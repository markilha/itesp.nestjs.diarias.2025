import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IDSISTEMA } from 'src/util/variaveis/variaveis';
import { preencherZeros } from 'src/util/preencherZero';
import { AuthUserDto } from './use.auth.Dto';
import { PerfilAcesso } from 'src/users/users.dto';
import { PpessoaService } from 'src/ppessoa/ppessoa.service';



@Injectable()
export class AuthService {
  private readonly jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ppessoaService: PpessoaService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
  }

  async signIn(login: string, senha: string): Promise<any> {
    const fountUser = await this.usersService.findByUserName(login); 

       if (!fountUser || !bcryptCompareSync(senha, fountUser.senha)) {
      throw new UnauthorizedException('Usuário ou senha não conferem!!!');
    }

    const acesso = await this.usersService.findNivel(fountUser.id_usuario);
    let perfilAcesso: PerfilAcesso[];

    perfilAcesso = await this.usersService.findPerfilAcesso(IDSISTEMA.id_sistema);
   
 
    let roles = [];

    if (acesso.length > 0) {
      acesso
        .map((item) => {
          if (item.id_sistema === perfilAcesso[0].id_sistema) {       
            const perfil = perfilAcesso.find((perfil) => perfil.id_perfil_acesso === item.id_perfil_acesso);     
            roles.push(perfil.descricao);           
          }
          return '';
        })
        .filter((accessLevel) => accessLevel);
    }    

    const ppessoa = await this.ppessoaService.find({ chapa: fountUser.chapa}); 
    const payload: AuthUserDto = {
      sub: fountUser.id_usuario,
      login: fountUser.login,   
      chapa: preencherZeros(fountUser.chapa,6),   
      roles: roles,    
      permissao: ppessoa.PERMISSAO,  
      codsecao: ppessoa.CODSECAO
    }; 
    
    const token = this.jwtService.sign(payload);    
    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }

 
  async createPasswordResetToken(email: string): Promise<any> {
    try {      
     
      const payload = {
        sub: email,     
      };    
    
     const token = 'token teste 123';
      return {
        token,
        expiresIn: '1h',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao gerar token  de redefinição de senha');
      
    }

  }


}
