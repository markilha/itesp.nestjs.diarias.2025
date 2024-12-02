import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';
import { Repository } from 'typeorm';
import { paramsItemRecurso } from './itensreq.Dto';
import {
  SelecionaItenFunc,
  SelecionaItensFunc,
  SelecionaItensRecurso,
} from 'src/util/selects/itensRecurso';

@Injectable()
export class itensreqrecService {
  constructor(
    @InjectRepository(itensreqrecEntity, 'oracleConnection')
    private itensreqrecRepository: Repository<itensreqrecEntity>,
  ) {}

  async create(data: Partial<itensreqrecEntity>): Promise<itensreqrecEntity> {
    try {
      const item = await this.itensreqrecRepository.create(data);
      return await this.itensreqrecRepository.save(item);
      
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "Ocorreu erro ao criar item recurso",
        HttpStatus.NOT_FOUND,
      );
      
    }
  }

  async findOne(ITE_ID_CODIGO: number) {
    try {
      return await this.itensreqrecRepository.findOneOrFail({
        where: { ITE_ID_CODIGO },
      });
    } catch (error) {
      throw new HttpException(
        `Item com codigo: ${ITE_ID_CODIGO} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async selecionaItensRecurso(params: paramsItemRecurso): Promise<any> {
    try {
      let where = '';
      let paramsWhere = [];

      if (params.RRE_ID_CODIGO) {
        where = SelecionaItenFunc;
        paramsWhere = [params.CHAPA, params.RRE_ID_CODIGO];
      } else {
        where = SelecionaItensFunc;
        paramsWhere = [params.CHAPA];
      }

      const result = await this.itensreqrecRepository.query(
        `${SelecionaItensRecurso} ${where}`,
        paramsWhere,
      );
      if (result.length > 0) {
        return result;
      } else {
        throw new HttpException('Nenhum item  encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Ocorreu erro ao buscar itens recurso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(newItem: itensreqrecEntity): Promise<itensreqrecEntity> {
    const item = await this.findOne(newItem.ITE_ID_CODIGO);
    this.itensreqrecRepository.merge(item, newItem);
    return await this.itensreqrecRepository.save(item);
  }
}
