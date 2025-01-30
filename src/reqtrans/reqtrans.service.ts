import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, In, Repository } from 'typeorm';
import { FindAllParams, reqtransDto, updateStatusDto } from './reqtransDto';
import { reqtransEntity } from '../database/db_oracle/entities/requisicaoTrans.entity';
import { getPaginatedQuery } from 'src/util/paginacao/paginaQuery';

@Injectable()
export class reqtransService {
  constructor(
    @InjectRepository(reqtransEntity, 'oracleConnection')
    private readonly reqtransRepository: Repository<reqtransEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<reqtransDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<reqtransEntity> = {};

      if (params.REQ_ID_CODIGO) {
        searchParams.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }
 const queryBuilder = this.reqtransRepository
        .createQueryBuilder('r')
        .select([
          'r.REQ_ID_CODIGO as REQ_ID_CODIGO',
          'r.REG_ID_CODIGO as REG_ID_CODIGO',
          'r.COD_MUNICIP as COD_MUNICIP',
          'r.TRA_ID_CODIGO  as TRA_ID_CODIGO',
          'r.REQ_DTREQ  as REQ_DTREQ',
          'r.REQ_DTSAIDA  as REQ_DTSAIDA',
          'r.REQ_MOTORISTA  as REQ_MOTORISTA',
          'r.REQ_HSAIDA as REQ_HSAIDA',
          'r.REQ_DTRET  as REQ_DTRET',
          'r.REQ_MOTIVO as REQ_MOTIVO',
          'r.REQ_HRET as REQ_HRET',
          'r.REQ_KM as REQ_KM',
          'r.REQ_STATUS as REQ_STATUS',
          'r.REQ_DIARIA as REQ_DIARIA',
          'r.REQ_INTEGRAL as REQ_INTEGRAL',
          'r.REQ_PARCIAL  as REQ_PARCIAL',
          'r.REQ_ESPECIAL as REQ_ESPECIAL',
          'r.REQ_PACOTE as REQ_PACOTE',
          'r.REQ_GOVERNADOR as REQ_GOVERNADOR',       
         
        ])
        .where(searchParams);
      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.reqtransRepository.query(paginatedQuery, parameters);
      return result;

      
    } catch (error) {
      throw new HttpException('Erro ao buscar as requisições', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(reqtrans: reqtransDto): Promise<reqtransDto> {
    try {
      const newreqtrans = await this.reqtransRepository.save(reqtrans);
      return new reqtransDto(newreqtrans);
    } catch (error) {     
      throw new HttpException('Erro ao criar o requisicao', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(REQ_ID_CODIGO: number) {
    try {
           
      const item = await this.reqtransRepository.query(
        `SELECT 
        r.*,
        c.NME_MUNIC,
        t.TRA_DESCRICAO        
        FROM TRANSPORTE.S001_REQUISICAO r
        LEFT JOIN COMUM.MUNICIPIOS_IBGE_IGC c ON r.COD_MUNICIP = c.COD_MUNICIP
        LEFT JOIN TRANSPORTE.S001_TRANSMEIO t ON t.TRA_ID_CODIGO = r.TRA_ID_CODIGO                   
        WHERE r.REQ_ID_CODIGO = :REQ_ID_CODIGO`,
        [REQ_ID_CODIGO],
      );  
      if (!item || item.length === 0) {
        throw new HttpException(
          `Requisicao com código: ${REQ_ID_CODIGO} não encontrada`,
          HttpStatus.NOT_FOUND,
        );
      }  
      return item[0];
    } catch (error) {
      console.log(error)
      throw new HttpException(        
        `Erro ao buscar o Requisicao com código: ${REQ_ID_CODIGO}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      await this.findOne(reqIdCodigo);   

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
      console.log(error);
      throw new HttpException(
        'Erro ao atualizar o status da requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancela(reqIdCodigo: number): Promise<reqtransEntity> {
    if (!reqIdCodigo) {
      throw new HttpException('Código da requisição não informado!!!', HttpStatus.BAD_REQUEST);
    }
    const params = { REQ_ID_CODIGO: reqIdCodigo, REQ_STATUS: 'CANCELADA' };
    const result = this.updatereqStatus(params);
    return result;
  }

  async updatereqStatus(params: updateStatusDto): Promise<reqtransEntity> {
    const result = await this.findOne(params.REQ_ID_CODIGO);
    result.REQ_STATUS = params.REQ_STATUS;
    return this.reqtransRepository.save(result);
  }

}
