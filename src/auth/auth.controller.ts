import { Body, Controller, Post } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('login')
   async signin(@Body('login') login: string, @Body('senha') senha: string):  Promise<AuthResponseDto> {
        return await this.authService.signIn(login, senha);

    }
}
