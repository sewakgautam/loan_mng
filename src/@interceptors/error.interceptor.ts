import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import {
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Observable, catchError, throwError } from 'rxjs';
import { NotifyService } from 'src/notify/notify.service';
import { UnburnTokenExpiredException } from 'src/utils/burn';
import { LogicalError } from 'src/utils/error';
import { errorMessage } from 'src/utils/prisma-error-codes';

/*
Reference: https://www.prisma.io/docs/orm/reference/error-reference#error-codes 
*/

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    constructor(private readonly notifyService: NotifyService) {}

    intercept(
        _context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError((err) => {
                console.log(err);

                let message = 'Something went wrong. Issue occured';

                if (err instanceof LogicalError) {
                    err.report(this.notifyService);
                    return throwError(
                        () => new BadRequestException(err.message),
                    );
                }

                if (err instanceof HttpException) {
                    // user defined error should be passed
                    return throwError(() => err);
                }
                if (err instanceof PrismaClientRustPanicError)
                    message = err.message;
                else if (err instanceof PrismaClientKnownRequestError)
                    message = errorMessage(err.code, err.message, err.meta);
                else if (err instanceof PrismaClientUnknownRequestError)
                    message = err.message;
                else if (err instanceof PrismaClientValidationError)
                    message = err.message;
                else if (err instanceof UnburnTokenExpiredException)
                    message = 'Resource could not be found or expired';
                else
                    message =
                        'Unknown expection. Please Contact the developer.';

                return throwError(() => new BadRequestException(message));
            }),
        );
    }
}
