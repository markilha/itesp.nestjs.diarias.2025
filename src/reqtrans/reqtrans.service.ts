import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, reqtransDto } from './reqtransDto';
import { reqtransEntity } from '../database/db_oracle/entities/requisicaoTrans.entity';

@Injectable()
export class reqtransService {
  constructor(
    @InjectRepository(reqtransEntity, 'oracleConnection')
    private readonly reqtransRepository: Repository<reqtransEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<reqtransDto[]> {
    try {
      const searchParams: FindOptionsWhere<reqtransEntity> = {};

      if (params.REQ_ID_CODIGO) {
        searchParams.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }

      let reqtranss: reqtransEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqtranss = await this.reqtransRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqtranss = await this.reqtransRepository.find({
          where: searchParams,
        });
      }
      return reqtranss.map((reqv) => new reqtransDto(reqv));
    } catch (error) {
      throw new HttpException('Erro ao buscar as requisições', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(reqtrans: reqtransDto): Promise<reqtransDto> {
    try {
      const newreqtrans = await this.reqtransRepository.save(reqtrans);
      return new reqtransDto(newreqtrans);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar o requisicao', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //update
  async update(reqtrans: reqtransDto): Promise<reqtransDto> {
    try {
      const reqtransToUpdate = await this.reqtransRepository.findOne({
        where: { REQ_ID_CODIGO: reqtrans.REQ_ID_CODIGO },
      });

      if (!reqtransToUpdate) {
        throw new HttpException('Requisição não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.reqtransRepository.update({ REQ_ID_CODIGO: reqtrans.REQ_ID_CODIGO }, reqtrans);

      return reqtrans;
    } catch (error) {
      throw new HttpException('Erro ao atualizar a requisição', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(reqIdCodigo: number, status: string): Promise<boolean> {
    try {
      const reqtransToUpdate = await this.reqtransRepository.findOne({
        where: { REQ_ID_CODIGO: reqIdCodigo },
      });

      await this.reqtransRepository.query(
        `UPDATE TRANSPORTE.S001_REQUISICAO SET
         TRANSPORTE.S001_REQUISICAO.REQ_STATUS = :status
         WHERE TRANSPORTE.S001_REQUISICAO.REQ_ID_CODIGO = :reqIdCodigo
         AND TRANSPORTE.S001_REQUISICAO.REQ_ID_CODIGO NOT IN (
           SELECT REQ_ID_CODIGO FROM TRANSPORTE.S001_REQUISICAO 
           WHERE REQ_ID_CODIGO = :reqIdCodigo 
           AND REQ_STATUS IN ('FINALIZADA', 'AUTORIZADA PELO DIRETOR EXECUTIVO')
         )`,
        [status, reqIdCodigo, reqIdCodigo],
      );
      return true;
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar o status da requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
