import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requisicao } from 'src/db/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './requisicao.dto';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(Requisicao)
    private requisicaoRepository: Repository<Requisicao>,
  ) {}

  async findAll(params: FindAllParams): Promise<Requisicao[]> {
    const searchParams: FindOptionsWhere<Requisicao> = {};

    if (params.reqIdCodigo) {
      searchParams.reqIdCodigo = params.reqIdCodigo;
    }
    if (params.codMunicipio) {
      searchParams.codMunicipio = params.codMunicipio;
    }
    if (params.reqStatus) {
      searchParams.reqStatus = params.reqStatus;
    }

    // Verifica se os parâmetros page e limit foram fornecidos
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;
      // Retorna os registros paginados
      return await this.requisicaoRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    // Se page e limit não forem fornecidos, retorna todos os registros
    return await this.requisicaoRepository.find({
      where: searchParams,
    });
  }
}
