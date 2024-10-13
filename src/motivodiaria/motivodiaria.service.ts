import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotivodiariaEntity } from 'src/database/db_mysql/entities/motivoDiaria.entity';
import { FindAllParams } from 'src/diariaviagem/diariaviagemDto';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class MotivodiariaService {
  constructor(
    @InjectRepository(MotivodiariaEntity, 'mysqlConnection')
    private mDiariaRepository: Repository<MotivodiariaEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<MotivodiariaEntity[]> {
    const searchParams: FindOptionsWhere<MotivodiariaEntity> = {};

 
  
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

     

      return await this.mDiariaRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.mDiariaRepository.find({
      where: searchParams,
    });
  }

  
  
}
