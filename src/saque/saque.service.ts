import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueEntity } from 'src/database/db_oracle/entities/saque.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, SaqueDto } from './saqueDto';

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity)
    private readonly saqueRepository: Repository<SaqueEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<SaqueDto[]> {
    try {
      const searchParams: FindOptionsWhere<SaqueEntity> = {};

      if (params.sqeIdCodigo) {
        searchParams.sqeIdCodigo = params.sqeIdCodigo;
      }

      let saques: SaqueEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        saques = await this.saqueRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        saques = await this.saqueRepository.find({
          where: searchParams,
        });
      }

      return saques.map((reqv) => new SaqueDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
