import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/db_mysql/entities/user.entity';
import { FindOptionsWhere, ILike, IsNull, Like, Not, Repository } from 'typeorm';
import {
  FindAllParams,
  FindAllParamsDto,
  PerfilAcesso,
  returnTotal,
  userNivelDto,
  UsersDto,
} from './users.dto';
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

  async findAll(params: FindAllParams): Promise<returnTotal> {
    const searchParams: FindOptionsWhere<UserEntity> = {};

    if (params.nome) {
      searchParams.nome = ILike(`%${params.nome}%`);
    }
    if (params.login) {
      searchParams.login = ILike(`%${params.login}%`);
    }

    let users = [];

    const filters = {
      ...searchParams,
      chapa: Not(IsNull()),
    };
    users = await this.usersRepository.find({ where: filters });
    const total = users.length;

    if (params.page && params.limit) {
      const page = params.page || 1;
      const limit = params.limit || 10;
      users = await this.usersRepository.find({
        where: filters,
        take: limit,
        skip: (page - 1) * limit,
      });
    }

    users = users.map(user => ({
      ...user,
      chapa: user.chapa.toString().padStart(6, '0'),
    }));

    return { data: users, total };
  }

  async findOne(params: FindAllParamsDto): Promise<UserEntity> {
    try {
      const searchParams: FindOptionsWhere<UserEntity> = {};
      if (params.id_usuario) {
        searchParams['id_usuario'] = params.id_usuario;
      }

      if (params.chapa) {
        searchParams['chapa'] = params.chapa;
      }

      if (params.nome) {
        searchParams['nome'] = ILike(`%${params.nome}%`);
      }

      const user = await this.usersRepository.findOneOrFail({ where: searchParams });
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
      throw new HttpException(`Erro ao buscar nível do usuario`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findPerfilAcesso(id_sistema: number): Promise<PerfilAcesso[]> {
    try {
      const perfis = await this.usersRepository.query(
        `
        SELECT * FROM ace_perfil_acesso 
        WHERE id_sistema = ?
        `,
        [id_sistema],
      );
      if (!perfis || perfis?.length === 0) {
        throw new HttpException(
          `Perfil ${id_sistema} de acesso não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return perfis;
    } catch (error) {
      throw new HttpException(
        error.message || `Erro ao buscar perfil de acesso do sistema ${id_sistema}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserName(login: string): Promise<UserEntity | null> {
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
