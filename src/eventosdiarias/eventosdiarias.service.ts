import { Injectable } from '@nestjs/common';
import { FindAllParams } from './envtosdiariasDto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EventosDiariasEntity } from 'src/database/db_oracle/entities/eventosDiaria.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventosdiariasService {
    constructor(
        @InjectRepository(EventosDiariasEntity, 'oracleConnection')
        private eventosDiariasRepository: Repository<EventosDiariasEntity>
      ) {}

    async findAll(params: FindAllParams): Promise<EventosDiariasEntity[]> {
        const searchParams: FindOptionsWhere<EventosDiariasEntity> = {};   
       
        if (params.chapa) {
          searchParams['chapa'] = params.chapa;
        }
    
        if (params.page && params.limit) {
          const page = params.page;
          const limit = params.limit;
          const skip = (page - 1) * limit;
    
          return await this.eventosDiariasRepository.find({
            where: searchParams,
            skip,
            take: limit,
          });
        }
    
        return await this.eventosDiariasRepository.find({
          where: searchParams,
        });
      }
}
