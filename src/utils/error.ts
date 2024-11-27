import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { NotifyService } from 'src/notify/notify.service';

export class LogicalError extends HttpException {
    constructor(
        response: string | Record<string, any>,
        private meta?: Record<string, any>,
        options?: HttpExceptionOptions,
    ) {
        super(response, 500, options);
    }
    get _stack() {
        return this.stack;
    }

    /*
     *
     * report error to admin
     * */
    report(notify: NotifyService) {
        notify.notify(
            `
Error: ${this.message}
Stack Trace: ${this._stack}
Meta:  ${this.meta ? JSON.stringify(this.meta) : 'None'}
                  `,
            (data) => {
                return {
                    data,
                    to: ['vyastechnp@gmail.com', 'sujan.official57@gmail.com'],
                    subject: `Error: ${this.message}`,
                };
            },
        );
    }
}
