import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.JWT_SECRET}`,
        });
    }

    async validate(payload: JwtPayload): Promise<UserDto> {
        const user = await this.authService.getUserById(payload.id)
        if (!user) {
            throw new UnauthorizedException("Token invalid")
        }
        return user
    }
}
