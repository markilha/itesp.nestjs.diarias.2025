import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ndocumentoEntity } from '../database/db_oracle/entities/ndocumento.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ndocumentoService {
  constructor(
    @InjectRepository(ndocumentoEntity, 'oracleConnection')
    private ndocumentoRepository: Repository<ndocumentoEntity>,
  ) {}


  async lastId(): Promise<number> {
    try {
      const lastId = await this.ndocumentoRepository.query(`SELECT MAX(a.NDO_ID_CODIGO) AS lasId FROM S009_NDOCUMENTO a`);      
      return lastId[0].LASID;
    } catch (error) {      
      throw new HttpException('Não foi possível buscar o último ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //create
  async create(ndocumentoDto: ndocumentoEntity): Promise<ndocumentoEntity> {
    try {
      return await this.ndocumentoRepository.save(this.ndocumentoRepository.create(ndocumentoDto));
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível criar o documento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  } 

}
