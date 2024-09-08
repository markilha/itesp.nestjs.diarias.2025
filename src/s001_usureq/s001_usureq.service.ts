import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S001Usureq } from 'src/database/db_oracle/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UsureqDto } from './usureqDto';

@Injectable()
export class S001UsureqService {
  constructor(
    @InjectRepository(S001Usureq)
    private usureqRepository: Repository<S001Usureq>,
  ) {}

  async findAll(params: FindAllParams): Promise<S001Usureq[]> {
    const searchParams: FindOptionsWhere<S001Usureq> = {};

    if (params.reqIdCodigo) {
      searchParams.reqIdCodigo = params.reqIdCodigo;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.usureqRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.usureqRepository.find({
      where: searchParams,
    });
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
