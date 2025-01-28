import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DespesaDiariaEntity } from '../database/db_oracle/entities/despesaDiaria.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CargoDto, FindAllParams } from './despesadiariaDto';

@Injectable()
export class DespesadiariaService {
  constructor(
    @InjectRepository(DespesaDiariaEntity, 'oracleConnection')
    private despesaRepository: Repository<DespesaDiariaEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<DespesaDiariaEntity[]> {
    try {
      const searchParams: FindOptionsWhere<DespesaDiariaEntity> = {};

      if (params.nome) {
        searchParams['nome'] = ILike(`%${params.nome}%`);
      }

      if (params.cargo) {
        searchParams['cargo'] = params.cargo;
      }

      return await this.despesaRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(cargo: string): Promise<CargoDto> {
    try {
      const result = await this.despesaRepository
        .createQueryBuilder('r')
        .select(
          `
          r.DTD_ID_CODIGO as "DTD_ID_CODIGO",
          r.DES_ID_CODIGO as "DES_ID_CODIGO",
          r.DTD_DESCRICAO as "DTD_DESCRICAO",
          r.TDE_ID_CODIGO as "TDE_ID_CODIGO",
          r.DTD_VALOR_MAX as "DTD_VALOR_MAX",
          r.CARGO as "CARGO",
          r.NOME as "NOME"
          `,
        )
        .where('r.cargo = :cargo', { cargo })
        .andWhere('ROWNUM = 1')
        .getRawOne();

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Erro ao buscar despesa diaria ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
