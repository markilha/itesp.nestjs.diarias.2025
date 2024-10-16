import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UsureqDto, CreateUsureqDto } from './usureqDto';
import {  ReturnRequiscaoDto } from './returnUserReqDto';

import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';


import { UfespService } from 'src/ufesp/ufesp.service';

import { ReqnumerarioService } from 'src/reqnumerario/reqnumerario.service';
import { PcargoService } from 'src/pcargo/pcargo.service';

export interface PcargoDto {
  codigo: string;
  nome: string;
  ufesp?: number;
}

@Injectable()
export class UsureqService {
  private readonly relations = [
    'pfunc',
    'requisicao.municipio_partida',
    'requisicao',
    'requisicao.transmeio',
    'requisicao.municipio',
    'requisicao.destino',
    'requisicao.destino.municipio',
  ];

  constructor(
    @InjectRepository(UsuReqEntity, 'mysqlConnection')
    private usureqRepository: Repository<UsuReqEntity>,

    @InjectRepository(CreateUsuReqEntity, 'mysqlConnection')
    private mysqlRepository: Repository<CreateUsuReqEntity>,
  
   
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnRequiscaoDto[]> {
    try {
      const searchParams2: FindOptionsWhere<UsuReqEntity> = {};
      if (params.reqIdCodigo) {
        searchParams2.reqIdCodigo = params.reqIdCodigo;
      }

      if (params.chapa) {
        searchParams2.chapa = params.chapa;
      }

      let users: UsuReqEntity[];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

       users = await this.usureqRepository.find({
          where: searchParams2,
          skip,
          take: limit,
          relations: this.relations,
        });
      } else {
        users = await this.usureqRepository.find({
          where: searchParams2,
          relations: this.relations,
        });
      }

       return users.map(user => new ReturnRequiscaoDto(user));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createusureqDto: CreateUsureqDto): Promise<UsureqDto> {
    try {
      if (!createusureqDto.codColigada) {
        createusureqDto.codColigada = 1;
      }
      const novoUsuReq = this.mysqlRepository.create(createusureqDto);
      return await this.mysqlRepository.save(novoUsuReq);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao salvar a requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
