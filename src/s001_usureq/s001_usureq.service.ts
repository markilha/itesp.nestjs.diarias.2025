import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_oracle/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UsureqDto } from './usureqDto';
import { ReturnUserReqDto } from './returnUserReqDto';


@Injectable()
export class S001UsureqService {
  constructor(
    @InjectRepository(UsuReqEntity)
    private usureqRepository: Repository<UsuReqEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnUserReqDto[]> {
    const searchParams: FindOptionsWhere<UsuReqEntity> = {}; 
    if (params.reqIdCodigo) {
      searchParams.reqIdCodigo = params.reqIdCodigo;
    }
    if (params.chapa) {
      searchParams.chapa = params.chapa;
    }

    let users: UsuReqEntity[];
    
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      users = await this.usureqRepository.find({
        where: searchParams,
        skip,
        take: limit,
        relations: ['pessoa'], 
      });
    } else {
      users = await this.usureqRepository.find({
        where: searchParams,
        relations: ['pessoa'],
      });
    }
   
    return users.map(user => new ReturnUserReqDto(user));
}


  async create(usureqDto: UsureqDto): Promise<UsureqDto> {
    try {
      const novoUsuReq = this.usureqRepository.create(usureqDto);
      return await this.usureqRepository.save(novoUsuReq);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar a requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(dto: UsureqDto): Promise<{ message: string }> {
    try {
      const result = await this.usureqRepository.delete({
        reqIdCodigo: dto.reqIdCodigo,
        chapa: dto.chapa,
      });

      if (result.affected === 0) {
        return {
          message: `Requisição com ID ${dto.reqIdCodigo} e chapa ${dto.chapa} não encontrada.`,
        };
      }
      return { message: 'Requisição removida com sucesso.' };
    } catch (error) {
      throw new HttpException('Erro ao remover a requisição', error.message);
    }
  }
}
