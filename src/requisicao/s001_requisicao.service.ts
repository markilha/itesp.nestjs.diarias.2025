import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisicaoEntity } from 'src/database/db_oracle/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './requisicao.dto';
import { RequisicaoDto } from './requisicao.dto';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity)
    private requisicaoRepository: Repository<RequisicaoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<RequisicaoEntity[]> {
    try {
      const searchParams: FindOptionsWhere<RequisicaoEntity> = {};
      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }
      if (params.codMunicipio) {
        searchParams.codMunicipio = params.codMunicipio;
      }
      if (params.reqStatus) {
        searchParams.reqStatus = params.reqStatus;
      }
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;
        // Retorna os registros paginados
        return await this.requisicaoRepository.find({
          where: searchParams,
          skip,
          take: limit,
          relations: ['usereq','usereq.pessoa'],
        });
      }
      return await this.requisicaoRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRequisicao(requisicaoDto: RequisicaoDto): Promise<RequisicaoEntity> {
    try {
      const novaRequisicao = this.requisicaoRepository.create(requisicaoDto);
      return await this.requisicaoRepository.save(novaRequisicao);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Requisição já existe', HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          'Erro ao criar a requisição',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  } 


  async removeRequisicao(reqIdCodigo: number): Promise<{message:string}> {
    try {
      const result = await this.requisicaoRepository.delete(reqIdCodigo);
      if (result.affected === 0) {
        throw new HttpException(`Requisição com ID ${reqIdCodigo} não encontrada.`,HttpStatus.NOT_FOUND);
      }
      return { message: 'Requisição removida com sucesso.' };

    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao remover a requisição',
        error.message,
      );
    }
  }
}
