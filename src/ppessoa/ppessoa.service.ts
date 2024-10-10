import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_mysql/entities/ppessoa.entity';
import { PFuncEntity } from 'src/database/db_mysql/entities/pfunc.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, RMPessoaDto } from './ppessoa.dto';
import { returnRmDto } from './returnRmDto';


@Injectable()
export class PpessoaService {
  constructor(
    @InjectRepository(PPessoaEntity, 'mysqlConnection')
    private rmRepository: Repository<PPessoaEntity>,
    
    @InjectRepository(PFuncEntity, 'mysqlConnection')
    private funcRepository: Repository<PFuncEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<returnRmDto[]> {
    const searchParams: FindOptionsWhere<RMPessoaDto> = {};

    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }

    let rms: PPessoaEntity[];
  
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      rms = await this.rmRepository.find({
        where: searchParams,
        skip,
        take: limit,
        relations: ['pfunc'],
      });
    } else {
      rms = await this.rmRepository.find({
        where: searchParams,
        relations: ['pfunc'],
      });
    }   

    return rms.map((rm) => new returnRmDto(rm));
  }
  //findOne pelo codusuaril
  async findOne(chapa: string): Promise<returnRmDto> {
    const rm = await this.rmRepository.findOne({
      where: { codusuario:chapa }     
    });
    return new returnRmDto(rm);
  }

}
