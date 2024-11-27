import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async registerUser(createUser: RegisterDto) {
        const hash = await this.generateHash(createUser.password);

        const user = await this.prisma.user.create({
            data: {
                ...createUser,
                password: hash,
            },
            select: {
                password: true,
                username: true,
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });

        return await this.signToken({
            sub: user.id,
            username: user.username,
            email: user.fullName,
            fullName: user.fullName,
            role: user.role,
        });
    }

    async userInfo(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) throw new BadRequestException('User Not Found');
        return user;
    }

    async loginUser(cred: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: cred.username,
            },
        });

        const ERR_MSG = 'Credential not matched.';

        if (!user) throw new BadRequestException(ERR_MSG);

        const { password: hash, id, username } = user;

        const isPasswordMatch = await this.isPasswordCorrect(
            cred.password,
            hash,
        );

        // if (!isPasswordMatch) throw new BadRequestException(ERR_MSG);

        return await this.signToken({
            sub: id,
            username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        });
    }

    private async generateHash(password: string, salt = 10) {
        return await bcrypt.hash(password, salt);
    }

    private async isPasswordCorrect(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    private async signToken(payload: {
        sub: string;
        username: string;
        email: string;
        fullName: string;
        role: UserRole;
    }) {
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '42h',
            secret: this.config.get('JWT_SECRET'),
        });

        return { token };
    }
}
