import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UsureqDto, CreateUsureqDto } from './usureqDto';
import { ReturnUserReqDto, ReturnRequiscaoDto } from './returnUserReqDto';

import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';
import { DiariaService } from 'src/util/diaria.service';
import { Destino, DiariaCalculadaDto } from 'src/util/diariaDto';
import { verificarDestino } from 'src/util/verificaDestino';
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
    private diariaCalculada: DiariaService,
    private ufespService: UfespService,
    private reqNumerarioService: ReqnumerarioService,
    private pcargoService: PcargoService,
  ) {}

  // private buildSearchParams(
  //   params: FindAllParams,
  // ): FindOptionsWhere<ReturnUserReqDto> {
  //   const searchParams: FindOptionsWhere<ReturnUserReqDto> = {};
  //   if (params.reqIdCodigo) searchParams.reqIdCodigo = params.reqIdCodigo;
  //   if (params.chapa || params.usuMov)
  //     searchParams.chapa = params.chapa || params.usuMov;
  //   return searchParams;
  // }

  // private async findUsers(
  //   searchParams: FindOptionsWhere<ReturnUserReqDto>,
  //   params: FindAllParams,
  // ): Promise<UsuReqEntity[]> {
  //   const { page, limit } = params;
  //   const skip = page && limit ? (page - 1) * limit : undefined;
  //   const take = limit;
  //   return await this.usureqRepository.find({
  //     where: searchParams,
  //     skip,
  //     take,
  //     relations: this.relations,
  //   });
  // }

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

  // async findSaque(params: FindAllParams): Promise<ReturnUserReqDto | null> {
  //   try {
  //     const searchParams = this.buildSearchParams(params);
  //     const users = await this.findUsers(searchParams, params);

  //     if (users.length === 0) {
  //       throw new HttpException(
  //         'Requisição não encontrada',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     // Busca o valor mais recente da UFESP (Unidade Fiscal do Estado de São Paulo).
  //     const UFESP =
  //       (await this.ufespService.findMostRecentValue()).ufeValor || 0;

  //     for (const user of users) {
  //       // Valida se o município de destino da requisição é válido.
  //       const destino = verificarDestino(
  //         user.requisicao?.destino?.municipio?.munIdCodigo,
  //       );
  //       if (!destino) {
  //         console.warn(
  //           `Município de destino não encontrado para a requisição ${user.reqIdCodigo}`,
  //         );
  //         continue;
  //       }

  //       // Verifica se há um funcionário associado à requisição.
  //       if (!user.pfunc) {
  //         console.warn(
  //           `Funcionário não encontrado para a requisição ${user.reqIdCodigo}`,
  //         );
  //         continue;
  //       }

  //       // Busca o cargo do funcionário para cálculo de diárias, se existir.
  //       const cargoufesp = user.pfunc?.cargo
  //         ? await this.pcargoService.findOne(user.pfunc.cargo)
  //         : null;
  //       if (!cargoufesp) {
  //         console.warn('Função ou nível não definido.');
  //         continue;
  //       }

  //       // CONVERTER STRING PARA NUMBER
  //       const reqIntegral = Number(user.requisicao.reqIntegral) || 0;
  //       const reqParcial = Number(user.requisicao.reqParcial) || 0;

  //       // Calcula as diárias com base no UFESP, cargo, destino e outras informações da requisição.
  //       const diarias = this.diariaCalculada.calcularDiaria(
  //         UFESP,
  //         cargoufesp.ufesp || 0,
  //         destino as Destino,
  //         user.requisicao.reqPacote || 0,
  //         reqIntegral,
  //         reqParcial,
  //         user.requisicao.reqHRet,
  //       );

  //       // Soma as diárias integrais e parciais.
  //       const totalDiarias =
  //         diarias.diariaIntegral +
  //         diarias.diariaParcial40 +
  //         diarias.diariaParcial20;

  //       // Busca o total do numerário relacionado ao mês atual para o usuário.
  //       const totalNumerario =
  //         await this.reqNumerarioService.findTotalReNumerarioMesAtual(
  //           user.chapa,
  //         );

  //       // Calcula o total geral (diárias + numerário) e verifica se excede 50% do salário do funcionário.
  //       const totalGeral = totalDiarias + totalNumerario;
  //       const excedeu50Porcento = totalGeral > (user.pfunc.salario || 0) / 2;

  //       // Retorna um DTO com os dados do usuário e o resultado dos cálculos.
  //       return new ReturnUserReqDto(
  //         user,
  //         diarias.diariaIntegral,
  //         diarias.diariaParcial40,
  //         diarias.diariaParcial20,
  //         diarias.diariaBase,
  //         excedeu50Porcento,
  //         totalNumerario,
  //       );
  //     }

  //     // Retorna null caso não seja encontrado um usuário válido após as validações.
  //     return null;
  //   } catch (error) {
  //     console.log(error);
  //     // Lança uma exceção genérica em caso de erro durante o processamento.
  //     throw new HttpException(
  //       error.response || 'Erro buscar requisicao com calculo',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

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
