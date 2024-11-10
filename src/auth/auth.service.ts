import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { nivel } from 'src/util/variaveis/variaveis';

@Injectable()
export class AuthService {
  private readonly jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
  }

  async signIn(login: string, senha: string): Promise<AuthResponseDto> {
    const fountUser = await this.usersService.findByUserName(login);

    const acesso = await this.usersService.findNivel(fountUser.id_usuario);
    let roles = [];

    if (acesso.length > 0) {
      acesso
        .map((item) => {
          if (item.id_sistema === nivel.id_sistema) {
            const role = Object.keys(nivel).find(
              (key) => nivel[key] === item.id_perfil_acesso
            );
            if (role) {
              roles.push(role);
            }    
          }
          return '';
        })
        .filter((accessLevel) => accessLevel);
    }
   

    if (roles.length === 0) {
      throw new UnauthorizedException('Usuário sem acesso ao sistema');
    }

    if (!fountUser || !bcryptCompareSync(senha, fountUser.senha)) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = {
      sub: fountUser.id_usuario,
      login: fountUser.login,
      roles: roles,
    };

    const token = this.jwtService.sign(payload);
    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds     
    };
  }
}
