import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthDto, AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async signin(@Body() params: AuthDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(params.login, params.senha);
  }
}
