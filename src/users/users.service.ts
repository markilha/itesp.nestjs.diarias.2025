import {
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/db_users/entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, UsersDto, UserUpdateDto } from './users.dto';
import { hashSync as bcryptHashSync } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, 'db_users')
    private usersRepository: Repository<Users>,
  ) {}

  async create(userDTO: UsersDto): Promise<UsersDto> {

    userDTO.USER_PWD =  bcryptHashSync(userDTO.USER_PWD, 10);

    const createUser = await this.usersRepository.save(userDTO);
    return createUser;
  }


  async findAll(params: FindAllParams): Promise<Users[]> {
    const searchParams: FindOptionsWhere<Users> = {};

    if (params.REAL_NAME) {
      searchParams.REAL_NAME = ILike(`%${params.REAL_NAME}%`);
    }
    if (params.USERCS_NAME) {
      searchParams.USERCS_NAME = ILike(`%${params.USERCS_NAME}%`);
    }

    const users = await this.usersRepository.find({ where: searchParams });
    return users;
  }

 
  async remove(USER_ID: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { USER_ID } });
    if (!user) {
      throw new HttpException(
        `User with id ${USER_ID} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.usersRepository.delete(USER_ID);
  }

  async findOne(USER_ID: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { USER_ID } });
    if (!user) {
      throw new HttpException(
        `User with id ${USER_ID} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findByUserName(USERCS_NAME: string): Promise<UsersDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { USERCS_NAME },
    });

    if (!userFound) {
      return null;
    }
    return userFound;
  }

  async update(USER_ID: number, userUpdateDto: UserUpdateDto): Promise<UsersDto> {
    const user = await this.usersRepository.findOne({ where: { USER_ID } });
    if (!user) {
      throw new HttpException(
        `User with id ${USER_ID} not found`,
        HttpStatus.NOT_FOUND,
      );
    } 
    await this.usersRepository.update(USER_ID, userUpdateDto);
  
    return { ...user, ...userUpdateDto };
  }
}
  