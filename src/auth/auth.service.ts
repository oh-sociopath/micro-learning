import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new ForbiddenException('Wrong credentials');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            throw new ForbiddenException('Wrong credentials');
        }

        const token = await this.createToken(user.id, user.email, user.role);

        return {
            token
        };
    }

    async signup(signupDto: SignupDto) {
        const { email, password, role } = signupDto;

        const hash = await bcrypt.hash(password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hash,
                    role
                },
                select: {
                    email: true,
                    role: true,
                }
            })

            console.log('service: signup: user: ', user);

            return user;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }

            throw error;
        }
    }

    createToken(userId: number, email: string, role: string): Promise<string> {
        const data = {
            sub: userId,
            email,
            role
        };
        const secret = this.config.get('JWT_SECRET') || 'default-secret';

        console.log('authService: createToken: secret: ', secret);

        return this.jwt.signAsync(data, {
            expiresIn: '15m',
            secret,
        });
    }
}
