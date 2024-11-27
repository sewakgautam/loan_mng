import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Query,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/commons/decorators/getuser.decorator';
import { Public } from 'src/commons/decorators/public.decorator';
import { AdminGuard } from './@guards/admin.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService,
    ) {}

    @Post('register')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'User Registration API' })
    register(@Body() createUser: RegisterDto) {
        return this.authService.registerUser(createUser);
    }

    @Post('admin-register')
    @Public()
    @ApiOperation({ summary: 'User Registration API' })
    registerAdmin(
        @Body() createUser: RegisterDto,
        @Query('x-token') token: string,
    ) {
        const tokenTest = this.config.getOrThrow('ADMIN_TOKEN');
        if (token !== tokenTest)
            throw new ForbiddenException('Forbidden resource.');
        return this.register({ ...createUser, role: 'ADMIN' });
    }

    @Get('me')
    @ApiOperation({ summary: 'userInfo' })
    @ApiBearerAuth()
    info(@GetUser('sub') userId: string) {
        return this.authService.userInfo(userId);
    }

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'User Login API' })
    login(@Body() cred: LoginDto) {
        return this.authService.loginUser(cred);
    }
}
