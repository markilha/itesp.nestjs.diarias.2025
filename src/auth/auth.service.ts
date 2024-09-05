import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
  }

  async signIn(login: string, senha: string): Promise<AuthResponseDto> {
    const fountUser = await this.usersService.findByUserName(login);
  
    
    if (!fountUser || !bcryptCompareSync(senha, fountUser.senha)) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
  
    const payload = {
      sub: fountUser.id_usuario,
      login: fountUser.login,
    };
    
    const token = this.jwtService.sign(payload);
  
    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }
  
}
