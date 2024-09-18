import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Psecao } from 'src/database/db_oracle/entities/psecao.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams } from './psecaoDto';


@Injectable()
export class PsecaoService {
  constructor(
    @InjectRepository(Psecao)
    private pSecaoRepository: Repository<Psecao>,
  ) {}

  async findAll(params: FindAllParams): Promise<Psecao[]> {
    const searchParams: FindOptionsWhere<Psecao> = {};

    if (params.CODIGO) {
      searchParams['CODIGO'] = params.CODIGO;
    }

 
    if (params.DESCRICAO) {
        searchParams['DESCRICAO'] = ILike(`%${params.DESCRICAO}%`);
      }
      if (params.CIDADE) {
        searchParams['CIDADE'] = ILike(`%${params.CIDADE}%`);
      }



    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

    
      return await this.pSecaoRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.pSecaoRepository.find({
      where: searchParams,
    });
  }
}
