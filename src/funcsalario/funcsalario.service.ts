import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FuncSalarioEntity } from 'src/database/db_mysql/entities/funcsalario.entity';
import { FindAllParams } from './funcsalarioDto';

@Injectable()
export class FuncsalarioService {
  constructor(
    @InjectRepository(FuncSalarioEntity, 'mysqlConnection')
    private funcSalarioRepository: Repository<FuncSalarioEntity>,
  ) {}



  async findAll(params: FindAllParams): Promise<FuncSalarioEntity[]> {
    const searchParams: FindOptionsWhere<FuncSalarioEntity> = {};

    if (params.nome) {
        searchParams['nome'] = ILike(`%${params.nome}%`);
      }

    if (params.chapa) {
      searchParams['chapa'] = params.chapa;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.funcSalarioRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.funcSalarioRepository.find({
      where: searchParams,
    });
  }

}

