import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async create(userDTO: UsersDto): Promise<UsersDto> {
    const createUser = await this.usersRepository.save(userDTO);
    return createUser;
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
