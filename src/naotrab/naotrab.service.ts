/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { naotrabEntity } from '../database/db_oracle/entities/naotrab.entity';
import { Repository } from 'typeorm';

@Injectable()
export class naotrabService {
  constructor(
    @InjectRepository(naotrabEntity, 'oracleConnection')
    private naotrabRepository: Repository<naotrabEntity>,
  ) {}

  async findOne(REQ_ID_CODIGO: number) {
    try {
      const result = await this.naotrabRepository.find({
        where: { REQ_ID_CODIGO },
      });
      // Lança uma exceção se o array estiver vazio
      if (result.length === 0) {
        throw new HttpException('Horas não trabalhadas não encontrada', HttpStatus.NOT_FOUND);
      }

      // Retorna o array de registros encontrados
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async totalDiariaNaoTrabalhada(REQ_ID_CODIGO: number) {
    try {
      const result = await this.naotrabRepository.query(
        `
      SELECT 
        a.nao_id_codigo,
        a.req_id_codigo,
        a.nao_inicio,
        a.nao_fim,
        (a.nao_fim - a.nao_inicio) AS diarias
      FROM 
        transporte.s001_naotrab a
      WHERE 
        a.req_id_codigo = :REQ_ID_CODIGO
      ORDER BY 
        a.nao_inicio
        `,
        [REQ_ID_CODIGO],
      );
      //somar diarias
      let total = 0;
      result.forEach((element) => {
        total += element.DIARIAS;
      });
      return { dados: result, total };
    } catch (error) {
      throw new HttpException('Horas não trabalhadas não encontrada', HttpStatus.NOT_FOUND);
    }
  }
}
