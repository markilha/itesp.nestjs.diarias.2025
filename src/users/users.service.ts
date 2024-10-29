import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/db_mysql/entities/user.entity'; 
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, UsersDto, UserUpdateDto } from './users.dto';
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
    const user = await this.usersRepository.findOne({ where: { id_usuario } });
    if (!user) {
      throw new HttpException(
        `User with id ${id_usuario} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
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
}
