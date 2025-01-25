import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { passwordHash } from 'utils/password.utility';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(dto: SignUpDto) {
        const emailExists = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (emailExists) { throw new BadRequestException('Email already exists') }
        const usernameExists = await this.prisma.user.findUnique({
            where: {
                username: dto.username
            }
        })
        if (usernameExists) { throw new BadRequestException('Username already exists') }
        const hashedPassword = await passwordHash.cryptPassword(dto.password)
        await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username,
                password: hashedPassword
            }
        })
    }

    async signIn(dto: SignInDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (!user) {
            throw new BadRequestException("User not found")
        }
        const passwordMatches = await passwordHash.comparePassword(dto.password, user.password)
        if (!passwordMatches) {
            throw new BadRequestException("Invalid credentials")
        }
        const payload = {
            id: user.id
        }
        const token = this.jwtService.sign(payload)
        const refresh = this.jwtService.sign(payload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' },)

        return { accessToken: token, refreshToken: refresh, email: user.email, id: user.id }
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }

}
