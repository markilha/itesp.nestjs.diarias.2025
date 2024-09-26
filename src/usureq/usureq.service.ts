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

  async findAll(params: FindAllParams): Promise<ReturnRequiscaoDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReturnRequiscaoDto> = {};
      const result: ReturnRequiscaoDto[] = [];

      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }
      if (params.chapa) {
        searchParams.chapa = params.chapa;
      }

      if (params.usuMov) {
        searchParams.chapa = params.usuMov;
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
          relations: [
            'pfunc',
            'requisicao.municipio_partida',
            'requisicao',
            'requisicao.transmeio',
            'requisicao.municipio',
            'requisicao.destino',
            'requisicao.destino.municipio',
          ],
        });
      } else {
        users = await this.usureqRepository.find({
          where: searchParams,
          relations: [
            'pfunc',
            'requisicao',
            'requisicao.municipio_partida',
            'requisicao.transmeio',
            'requisicao.municipio',
            'requisicao.destino',
            'requisicao.destino.municipio',
          ],
        });
      }

      for (const user of users) {
        try {
          result.push(new ReturnRequiscaoDto(user));
        } catch (error) {
          console.error(
            `Erro ao processar a requisição ${user.reqIdCodigo}: ${error.message}`,
          );
        }
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSaque(params: FindAllParams): Promise<ReturnUserReqDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReturnUserReqDto> = {};
      const result: ReturnUserReqDto[] = [];

      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }
      if (params.chapa) {
        searchParams.chapa = params.chapa;
      }

      if (params.usuMov) {
        searchParams.chapa = params.usuMov;
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
          relations: [
            'pfunc',
            'requisicao.municipio_partida',
            'requisicao',
            'requisicao.transmeio',
            'requisicao.municipio',
            'requisicao.destino',
            'requisicao.destino.municipio',
          ],
        });
      } else {
        users = await this.usureqRepository.find({
          where: searchParams,
          relations: [
            'pfunc',
            'requisicao',
            'requisicao.municipio_partida',
            'requisicao.transmeio',
            'requisicao.municipio',
            'requisicao.destino',
            'requisicao.destino.municipio',
          ],
        });
      }

      const UFESP2 = await this.ufespService.findMostRecentValue();
      const UFESP = UFESP2.ufeValor || 0;

      for (const user of users) {
        try {
          const destino =
            verificarDestino(
              user.requisicao?.destino?.municipio?.munIdCodigo,
            ) || null;

          if (!destino) {
            console.warn(
              `Município de destino não encontrado para a requisição ${user.reqIdCodigo}`,
            );
            continue;
          }

          if (!user.pfunc) {
            console.warn(
              `Funcionário não encontrado para a requisição ${user.reqIdCodigo}`,
            );
            continue;
          }

          let cargoufesp = null;
          if (user.pfunc?.cargo) {
            cargoufesp =
              (await this.pcargoService.findOne(user.pfunc?.cargo)) || null;
          }

          let diarias: DiariaCalculadaDto;

          if (cargoufesp) {
            diarias = this.diariaCalculada.calcularDiaria(
              UFESP,
              cargoufesp?.ufesp || 0,
              destino as Destino,
              parseInt(user.requisicao.reqPacote) || 0,
              user.requisicao.reqIntegral,
              user.requisicao.reqParcial,
              user.requisicao.reqHRet,
            );
          } else {
            console.warn('Função ou nível não definido.');
            continue;
          }

          const totalDiarias =
            diarias.diariaIntegral +
            diarias.diariaParcial40 +
            diarias.diariaParcial20;

          const totalNumerario =
            await this.reqNumerarioService.findTotalReNumerarioMesAtual(
              user.chapa,
            );

          const totalGeral = totalDiarias + totalNumerario;
          const salario = user.pfunc.salario || 0;

          let excedeu50Porcento = false;

          if (totalGeral > salario / 2) {
            excedeu50Porcento = true;
          }

          result.push(
            new ReturnUserReqDto(
              user,
              diarias.diariaIntegral,
              diarias.diariaParcial40,
              diarias.diariaParcial20,
              diarias.diariaBase,
              excedeu50Porcento,
              totalNumerario,
            ),
          );
        } catch (error) {
          console.error(
            `Erro ao processar a requisição ${user.reqIdCodigo}: ${error.message}`,
          );
        }
      }

      return result;
    } catch (error) {
      console.log(error);
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
