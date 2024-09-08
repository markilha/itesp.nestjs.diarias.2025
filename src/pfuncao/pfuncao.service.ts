import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PfuncaoEntity } from 'src/database/db_oracle/entities/pfuncao.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams } from './pfuncaoDto';
import { returnPfuncaDto } from './returnPfuncaoDto';

@Injectable()
export class PfuncaoService {
  constructor(
    @InjectRepository(PfuncaoEntity)
    private pfuncaoRepository: Repository<PfuncaoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<returnPfuncaDto[]> {
    const searchParams: FindOptionsWhere<PfuncaoEntity> = {};

    if (params.CODIGO) {
      searchParams['CODIGO'] = params.CODIGO;
    }

    if (params.CBO) {
      searchParams['CBO'] = params.CBO;
    }

    if (params.NOME) {
      searchParams['NOME'] = ILike(`%${params.NOME}%`);
    }

    let pfuncoes: PfuncaoEntity[];

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;
      // Retorna os registros paginados
      pfuncoes = await this.pfuncaoRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }else{
      pfuncoes = await this.pfuncaoRepository.find({
        where: searchParams,
      });
    }

    return pfuncoes.map((pfuncao) => new returnPfuncaDto(pfuncao));
  }
}
