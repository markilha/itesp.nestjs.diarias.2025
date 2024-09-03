import {
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/db/entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, UsersDto, UserUpdateDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(params: FindAllParams): Promise<Users[]> {
    const searchParams: FindOptionsWhere<Users> = {};

    if (params.nome) {
      searchParams.nome = ILike(`%${params.nome}%`);
    }
    if (params.login) {
      searchParams.login = ILike(`%${params.login}%`);
    }

    const users = await this.usersRepository.find({ where: searchParams });
    return users;
  }

  async create(userDTO: UsersDto): Promise<UsersDto> {
    const createUser = await this.usersRepository.save(userDTO);
    return createUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.usersRepository.delete(id);
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
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

  async update(id: number, userUpdateDto: UserUpdateDto): Promise<UsersDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } 
    await this.usersRepository.update(id, userUpdateDto);
  
    return { ...user, ...userUpdateDto };
  }
}
  