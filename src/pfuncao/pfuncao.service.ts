import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pfuncao } from 'src/database/db_oracle/entities/pfuncao.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams } from './pfuncaoDto';


@Injectable()
export class PfuncaoService {
    constructor(
        @InjectRepository(Pfuncao)
        private pfuncaoRepository: Repository<Pfuncao>      
      ) {}

      async findAll(params: FindAllParams): Promise<Pfuncao[]> {
        const searchParams: FindOptionsWhere<Pfuncao> = {};        
    
        if (params.CODIGO) {
          searchParams['CODIGO'] = params.CODIGO;
        }
      
        if (params.CBO) {
          searchParams['CBO'] = params.CBO;
        }
     
        if (params.NOME) {
          searchParams['NOME'] = ILike(`%${params.NOME}%`);
        }
        

    
       
        if (params.page && params.limit) {
          const page = params.page;
          const limit = params.limit;
          const skip = (page - 1) * limit;
          // Retorna os registros paginados
          return await this.pfuncaoRepository.find({
            where: searchParams,
            skip,
            take: limit,
          });
        }
        
        return await this.pfuncaoRepository.find({
          where: searchParams,
        });
      }


}
