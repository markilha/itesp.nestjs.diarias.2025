import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  FindAllParams,
  ReturnRequisicaoDto,
  RequisicaoDto,
} from './requisicao.dto';

import {} from './returnRequisicao.dto';
import { UfespService } from 'src/ufesp/ufesp.service';
import { PcargoService } from 'src/pcargo/pcargo.service';
import { FuncsalarioService } from 'src/funcsalario/funcsalario.service';
import { DiariaService } from 'src/util/diaria.service';
import { verificarDestino } from 'src/util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'mysqlConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private pcargoService: PcargoService,
    private funcSalarioService: FuncsalarioService,
    private diariaCalculada: DiariaService,
    private SaquesMesService: SaquesMesService,
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
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
      if (params.chapa) {
        searchParams.chapa = params.chapa;
      }
  
      let requisicoes: RequisicaoEntity[];
  
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;
  
        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          skip,
          take: limit,
          relations: ['transmeio', 'destino', 'destino.municipio'],
        });
      } else {
        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          relations: ['transmeio', 'destino', 'destino.municipio'],
        });
      }
  
      const UFESP = (await this.ufespService.findMostRecentValue()).ufeValor || 0;
  
      const results = await Promise.all(
        requisicoes.map((requisicao) =>
          this.processRequisicao(requisicao, params.chapa, UFESP)
        )
      );
  
      return results;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async processRequisicao(
    requisicao: RequisicaoEntity,
    chapa: string,
    UFESP: number
  ): Promise<ReturnRequisicaoDto> {
    try {
      const data = new Date(requisicao.reqDtSaida);
      const ano = String(data.getFullYear()).slice(-2);
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const formatoYYMM = `${ano}/${mes}`;     
  
      const saqueMes = await this.SaquesMesService.somaMesAtual(chapa, formatoYYMM);
      const user = await this.funcSalarioService.findByCodigo(chapa);
      const salarioAtual = user?.salario || 0;
      const cargoufesp = await this.pcargoService.findOne(user.cargo);
      
      const reqIntegral = Number(requisicao.reqIntegral) || 0;
      const reqParcial = Number(requisicao.reqParcial) || 0;
      const destino = verificarDestino(requisicao?.destino?.municipio?.munIdCodigo);
  
      // Calcula as diárias com base no UFESP, cargo, destino e outras informações da requisição.
      const diarias = this.diariaCalculada.calcularDiaria(
        UFESP,
        cargoufesp.ufesp || 0,
        destino as Destino,
        requisicao.reqPacote || 0,
        reqIntegral,
        reqParcial,
        requisicao.reqHRet
      );
  
      return new ReturnRequisicaoDto(
        requisicao,
        diarias?.diariaIntegral,
        diarias?.diariaParcial40,
        diarias?.diariaParcial20,
        diarias?.diariaBase,
        saqueMes,
        salarioAtual
      );
    } catch (error) {
      console.error(`Erro ao processar a requisição: ${requisicao.regIdCodigo}`, error);
      // Retorna o DTO da requisição original para evitar quebra
      return new ReturnRequisicaoDto(requisicao);
    }
  }
  




  

  async createRequisicao(
    requisicaoDto: RequisicaoDto,
  ): Promise<RequisicaoEntity> {
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


  















  async removeRequisicao(reqIdCodigo: number): Promise<{ message: string }> {
    try {
      const result = await this.requisicaoRepository.delete(reqIdCodigo);
      if (result.affected === 0) {
        throw new HttpException(
          `Requisição com ID ${reqIdCodigo} não encontrada.`,
          HttpStatus.NOT_FOUND,
        );
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
