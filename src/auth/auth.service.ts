import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

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

  async signIn(login: string, senha: string): Promise<any> {
    const fountUser = await this.usersService.findByUserName(login);

    if (!fountUser || !bcryptCompareSync(senha, fountUser.senha)) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const acesso = await this.usersService.findNivel(fountUser.id_usuario);
    let roles = [];

    if (acesso.length > 0) {
      acesso
        .map((item) => {
          if (item.id_sistema === nivel.id_sistema) {
            const role = Object.keys(nivel).find((key) => nivel[key] === item.id_perfil_acesso);
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

    const payload = {
      sub: fountUser.id_usuario,
      login: fountUser.login,
      roles: roles,
    };

    // const acessToken = this.jwtService.sign({ ...payload, type: 'access' }, { expiresIn: '60s' });
    // const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '1h' });
    // return {
    //   acessToken,
    //   refreshToken,
    // }

    const token = this.jwtService.sign(payload);
    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    const users = await this.usersService.findByUserName(payload.login);

    const user = users.id_usuario === payload.sub;
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload = {
      sub: payload.id_usuario,
      login: payload.login,
      roles: payload.roles,
    };
    const newAccessToken = this.jwtService.sign(
      { ...newPayload, type: 'access' },
      { expiresIn: '60s' },
    );

    const newRefreshToken = this.jwtService.sign(
      { ...newPayload, type: 'refresh' },
      { expiresIn: '1h' },
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async createPasswordResetToken(email: string): Promise<any> {
    try {
      
      // const user = await this.usersService.findByUserName(email);
      // if (!user) {
      //   throw new BadRequestException('Login não encontrado');
      // }
      
      const payload = {
        sub: email,     
      };    
     // const token = this.jwtService.sign(payload);
     const token = 'token teste 123';
      return {
        token,
        expiresIn: '1h',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao gerar token  de redefinição de senha');
      
    }

  }

  // async sendPasswordResetEmail(email: string, token: string) {
  //   const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

  // }
}
