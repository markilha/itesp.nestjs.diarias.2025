import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateReqnumerarioDto, FindAllParams } from './reqnumerarioDto';
import { ReqnumerarioDto } from './reqnumerarioDto';
import { CreateReqNumerarioEntity } from 'src/database/db_mysql/entities/createReqNumerario.entity';
import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { SaqueService } from 'src/saque/saque.service';

@Injectable()
export class ReqnumerarioService {
  constructor(
    @InjectRepository(CreateReqNumerarioEntity, 'mysqlConnection')
    private readonly mysqlRepository: Repository<CreateReqNumerarioEntity>,

    private readonly saqueRepository: SaqueService,
  ) {}

  async findAll(params: FindAllParams): Promise<ReqnumerarioDto[]> {
    try {
      const searchParams: FindOptionsWhere<CreateReqNumerarioEntity> = {};

      if (params.rnuIdCodigo) {
        searchParams.rnuIdCodigo = params.rnuIdCodigo;
      }
      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }

      let reqnumerarios: CreateReqNumerarioEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqnumerarios = await this.mysqlRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqnumerarios = await this.mysqlRepository.find({
          where: searchParams,
        });
      }
      return reqnumerarios.map((reqv) => new ReqnumerarioDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createReqnumerarioDto: CreateReqnumerarioDto,
  ): Promise<CreateReqNumerarioEntity> {
    try {
      
      const dataAtual = new Date();
      const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });

      const saqueDados = new SaqueEntity();
      saqueDados.sqeVlSaque =
        createReqnumerarioDto.rnuVlIntegral +
        createReqnumerarioDto.rnuVlParcial20 +
        createReqnumerarioDto.rnuVlParcial40;
      saqueDados.sqeDtPedido = dataFormatada;

      const saque = await this.saqueRepository.create(saqueDados);


      if(!saque){
        throw new HttpException('Erro ao salvar o saque', HttpStatus.BAD_REQUEST);
      }

      createReqnumerarioDto.sqeIdCodigo = saque.sqeIdCodigo;

      const existingReqNumerario = await this.mysqlRepository.findOne({
        where: {
          chapa: createReqnumerarioDto.chapa,
          reqIdCodigo: createReqnumerarioDto.reqIdCodigo,
        },
      });   



      const reqNumerario = this.mysqlRepository.create(createReqnumerarioDto);

      

      if (existingReqNumerario) {
        throw new HttpException('Requisição já existe', HttpStatus.BAD_REQUEST);
      }

      return await this.mysqlRepository.save(reqNumerario);
    } catch (error) {     
      throw new HttpException(
        error.response || 'Erro ao salvar a requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async findTotalReNumerarioMesAtual(chapa: string): Promise<number> {
    try {
      const dataAtual = new Date();
      const primeiroDiaMes = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        1,
      );
      const ultimoDiaMes = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() + 1,
        0,
      );

      const total = await this.mysqlRepository
        .createQueryBuilder('s009_reqnumerario')
        .select(
          'SUM(COALESCE(s009_reqnumerario.RNU_VLINTEGRAL, 0) + COALESCE(s009_reqnumerario.RNU_VLPARCIAL20, 0) + COALESCE(s009_reqnumerario.RNU_VLPARCIAL40, 0))',
          'total',
        )
        .where('s009_reqnumerario.RNU_DTINICIO BETWEEN :inicio AND :fim', {
          inicio: primeiroDiaMes,
          fim: ultimoDiaMes,
        })
        .andWhere('s009_reqnumerario.CHAPA = :chapa', { chapa })
        .getRawOne();

      return total.total || 0;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
