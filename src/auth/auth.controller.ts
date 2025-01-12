import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() dto: SignUpDto): Promise<void> {
        return this.authService.signUp(dto)
    }

    @Post('login')
    async signIn(@Body() dto: SignInDto): Promise<{ accessToken: string; refreshToken: string; email: string }> {
        return this.authService.signIn(dto)
    }

}
