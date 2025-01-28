import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { destinoEntity } from '../database/db_oracle/entities/destino.entity';
import { Repository } from 'typeorm';


@Injectable()
export class destinoService {
  constructor(
    @InjectRepository(destinoEntity, 'oracleConnection')
    private destinoRepository: Repository<destinoEntity>,
  ) {}  

   async findOne(REQ_ID_CODIGO: number) {
    try {
      const item = await this.destinoRepository.query(
        `SELECT 
        d.DES_ID_CODIGO,
        d.REQ_ID_CODIGO,
        d.MUN_ID_CODIGO,
        d.DES_LOCAL,
        d.DES_OBSERVA,
        m.MUN_CIDADE      
        FROM TRANSPORTE.S001_DESTINO d
         left join TRANSPORTE.S001_MUNIC_DETRAN m on d.MUN_ID_CODIGO = m.MUN_ID_CODIGO
         WHERE d.REQ_ID_CODIGO = :REQ_ID_CODIGO`,
        [REQ_ID_CODIGO],
      ); 
      if (!item || item.length === 0) {
        throw new HttpException(
          `Destino com código: ${REQ_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }  
      return item[0];
    } catch (error) {
      console.log(error)
      throw new HttpException(        
        `Erro ao buscar o Destiono com o código: ${REQ_ID_CODIGO}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 
}
