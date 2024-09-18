import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_oracle/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UsureqDto, CreateUsureqDto } from './usureqDto';
import { ReturnUserReqDto } from './returnUserReqDto';
import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';
import { DiariaService } from 'src/util/diaria.service';
import { Destino, enumCargo, DiariaCalculadaDto } from 'src/util/diariaDto';
import { verificarDestino } from 'src/util/verificaDestino';
import { UfespService } from 'src/ufesp/ufesp.service';
import { PfuncaoService } from 'src/pfuncao/pfuncao.service';

@Injectable()
export class UsureqService {
  constructor(
    @InjectRepository(UsuReqEntity)
    private usureqRepository: Repository<UsuReqEntity>,

    @InjectRepository(CreateUsuReqEntity, 'mysqlConnection')
    private mysqlRepository: Repository<CreateUsuReqEntity>,

    private diariaCalculada: DiariaService,

    private ufespService: UfespService,

    private pfuncaoService: PfuncaoService,
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnUserReqDto[]> {
    try {
      const searchParams: FindOptionsWhere<UsuReqEntity> = {};
      const result: ReturnUserReqDto[] = [];

      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }
      if (params.chapa) {
        searchParams.chapa = params.chapa;
      }
      if (params.usuMov) {
        searchParams.usuMov = params.usuMov;
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
        const destino = verificarDestino(user.requisicao.codMunicipio);

        if (!destino) {
          throw new HttpException(
            `Código do município ${user.requisicao.codMunicipio} não encontrado.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const pfuncao = await this.pfuncaoService.findByCodigo(
          user.pfunc.CODFUNCAO,
        );

        const diarias: DiariaCalculadaDto = this.diariaCalculada.calcularDiaria(
          UFESP,
          pfuncao.NIVEL as enumCargo,
          destino as Destino,
          parseInt(user.requisicao.reqPacote) || 0,
          user.requisicao.reqIntegral,
          user.requisicao.reqParcial,
          user.requisicao.reqHRet,
        );

        result.push(
          new ReturnUserReqDto(
            user,
            diarias.diariaIntegral,
            diarias.diariaParcial40,
            diarias.diariaParcial20,
          ),
        );
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
