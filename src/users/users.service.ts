import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/db_mysql/entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, userNivelDto, UsersDto } from './users.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity, 'mysqlConnection')
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(userDTO: UsersDto): Promise<UsersDto> {
    userDTO.senha = bcryptHashSync(userDTO.senha, 10);
    const createUser = await this.usersRepository.save(userDTO);
    return createUser;
  }

  async findAll(params: FindAllParams): Promise<UserEntity[]> {
    const searchParams: FindOptionsWhere<UserEntity> = {};

    if (params.nome) {
      searchParams.nome = ILike(`%${params.nome}%`);
    }
    if (params.login) {
      searchParams.login = ILike(`%${params.login}%`);
    }

    const users = await this.usersRepository.find({ where: searchParams });
    return users;
  }

  async findOne(id_usuario: number): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { id_usuario } });
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Usuário não encotrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findNivel(id_usuario: number): Promise<userNivelDto[]> {
    try {
      const users = await this.usersRepository.query(
        `
        SELECT 
        usu.nome,
        usu.chapa,
        usu.login,
        ace.id_perfil_acesso,
        ace.id_sistema
        FROM usu_usuario_cpf usu
        INNER JOIN ace_usuario_perfil_acesso ace ON usu.id_usuario = ace.id_usuario
        WHERE usu.id_usuario = ?
        `,
        [id_usuario],
      );
      return users;
    } catch (error) {     
      throw new HttpException(
        `Erro ao buscar nível do usuario`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserName(login: string): Promise<UsersDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { login },
    });

    if (!userFound) {
      return null;
    }
    return userFound;
  }

  // async findByUserEmail(email: string): Promise<UsersDto | null> {
  //   const userFound = await this.usersRepository.findOne({
  //     where: { email },
  //   });

  //   if (!userFound) {
  //     return null;
  //   }
  //   return userFound;
  // }
}
