import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extornoEntity } from '../database/db_oracle/entities/extorno.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, extornoDto, upateExtornoDto } from './extornoDto';
import { DataUtils } from '../util/DataUtils';
import { SaqueService } from '../saque/saque.service';
import { selecinaReqNumerario, selecionaReqNumerario } from '../util/selects/reqNumerario';
import {
  alteraControleTrafego,
  alteraControleVoo,
  atualizarRequisicaoTransporte,
  buscarFuncionarioRequisicao,
  exluirFuncionarioRequisicao,
  insertAutoriza,
  selecionaAutoriza,
} from '../util/selects/extorno';
import { AuthUserDto } from '../auth/use.auth.Dto';
import { verificaAutorizacao } from '../util/permissao/permissao';
import { getPaginatedQuery } from 'src/util/paginacao/paginaQuery';

@Injectable()
export class extornoService {
  constructor(
    @InjectRepository(extornoEntity, 'oracleConnection')
    private extornoRepository: Repository<extornoEntity>,

    @Inject(forwardRef(() => SaqueService))
    private saqueService: SaqueService,
  ) {}

  async findAll(params: FindAllParams): Promise<extornoDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<extornoDto> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }

      const queryBuilder = this.extornoRepository
        .createQueryBuilder('r')
        .select([
          'r.SQE_ID_CODIGO as SQE_ID_CODIGO',
          'r.ITE_ID_CODIGO as ITE_ID_CODIGO',
          'r.RRE_ID_CODIGO as RRE_ID_CODIGO',
          'r.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'r.PCO_ID_CODIGO as PCO_ID_CODIGO',
          'r.FPA_ID_CODIGO as FPA_ID_CODIGO',
          'r.EXT_VALOR as EXT_VALOR',
          'r.EXT_DATA as EXT_DATA',
          'r.EXT_JUSTIFICA as EXT_JUSTIFICA',
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);

      const parameters = Object.values(queryBuilder.getParameters());

      const result = await this.extornoRepository.query(paginatedQuery, parameters);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneOrFail(SQE_ID_CODIGO: number): Promise<extornoDto> {
    try {
      const result = await this.extornoRepository
        .createQueryBuilder('r')
        .where('r.SQE_ID_CODIGO = :codigo', { codigo: SQE_ID_CODIGO })
        .maxExecutionTime(10000)
        .cache(false)
        .getOne();

      if (!result) {
        throw new HttpException('Não encontrou nenhum registro', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(SQE_ID_CODIGO: number, PCO_ID_CODIGO: number): Promise<extornoDto> {
    try {
      const result = await this.extornoRepository
        .createQueryBuilder('r')
        .select([
          'r.SQE_ID_CODIGO',
          'r.ITE_ID_CODIGO',
          'r.RRE_ID_CODIGO',
          'r.DIR_ID_CODIGO',
          'r.PCO_ID_CODIGO',
          'r.FPA_ID_CODIGO',
          'r.EXT_VALOR',
          'r.EXT_DATA',
          'r.EXT_JUSTIFICA',
        ])
        .where('r.SQE_ID_CODIGO = :codigo', { codigo: SQE_ID_CODIGO })
        .andWhere('r.PCO_ID_CODIGO = :codigo2', { codigo2: PCO_ID_CODIGO })
        .getOne();

      if (!result) {
        throw new HttpException('Não encontrou nenhum registro', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(extorno: extornoDto) {
    try {
      return await this.extornoRepository.save(this.extornoRepository.create(extorno));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(ex: any) {
    try {
      const extorno = await this.findOne(ex.SQE_ID_CODIGO, ex.PCO_ID_CODIGO);

      const newExtorno = new extornoEntity({
        ...extorno,
      });

      const result = this.extornoRepository.merge(newExtorno, ex);

      return await this.extornoRepository.save(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async extornoViagemNaoRealizada(dados: extornoDto, user: AuthUserDto) {
    try {
      const where = `And B.SQE_ID_CODIGO=:NSaque`;
      const reqNumerario: selecinaReqNumerario[] = await this.extornoRepository.query(
        `${selecionaReqNumerario} ${where}`,
        [dados.SQE_ID_CODIGO],
      );
      verificaAutorizacao(reqNumerario[0].CHAPA, user);
      const dataViagem = DataUtils.formatarDataAtualString();
      const saque = await this.saqueService.findOne(dados.SQE_ID_CODIGO);
      const dtSaida = DataUtils.formatDateToString(reqNumerario[0].REQ_DTSAIDA);

      const msg = `
      ESTORNO VIAGEM - Requisição de Viagem = ${reqNumerario[0]?.REQ_ID_CODIGO}, Meio de Transporte:${reqNumerario[0]?.TRA_ID_CODIGO}
      Data Prevista Saída:  ${dtSaida} , Hora Prevista Saída: ${reqNumerario[0]?.REQ_HRET}
      Data Prevista Retorno:${reqNumerario[0].REQ_DTREQ}, Hora Prevista Retorno: ${reqNumerario[0].REQ_HRET}
      Motitvo: ${reqNumerario[0].REQ_MOTIVO}
      ------------------------------------------------------------------ 
      Justificativa para o Estono: ${dados.EXT_JUSTIFICA}`;

      const extorno = new extornoDto({
        SQE_ID_CODIGO: dados.SQE_ID_CODIGO,
        ITE_ID_CODIGO: saque.iteIdCodigo,
        RRE_ID_CODIGO: saque.rreIdCodigo,
        DIR_ID_CODIGO: saque.dirIdCodigo,
        PCO_ID_CODIGO: 1,
        FPA_ID_CODIGO: saque.fpaIdCodigo,
        EXT_VALOR: dados.EXT_VALOR,
        EXT_DATA: dataViagem,
        EXT_JUSTIFICA: msg,
      });

      //06/10/2005 15:19:38
      //update data saque da tabela saque
      //await this.saqueService.updateDataPrestacao(dados.SQE_ID_CODIGO, dataViagem);
      return await this.extornoRepository.save(this.extornoRepository.create(extorno));
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async atualizaExtorno(SQE_ID_CODIGO: number, user: AuthUserDto) {
    try {
      const where = `And B.SQE_ID_CODIGO=:NSaque`;
      const reqNumerario = await this.extornoRepository.query(`${selecionaReqNumerario} ${where}`, [
        SQE_ID_CODIGO,
      ]);

      if (reqNumerario.length > 0) {
        //Excluir Usuário da Requisição /saque cancelada
        await this.extornoRepository.query(exluirFuncionarioRequisicao, [
          reqNumerario[0].REQ_ID_CODIGO,
          reqNumerario[0].CHAPA,
        ]);

        const UsuReq = await this.extornoRepository.query(buscarFuncionarioRequisicao, [
          reqNumerario[0].REQ_ID_CODIGO,
        ]);

        //Verifica se a requisição não possui mais usuários
        if (UsuReq.length === 0) {
          await this.extornoRepository.query(atualizarRequisicaoTransporte, [
            reqNumerario[0].REQ_ID_CODIGO,
          ]);
          //Altera Controle de Trafego
          await this.extornoRepository.query(alteraControleTrafego, [
            reqNumerario[0].REQ_ID_CODIGO,
          ]);
          //Altera Controle do Aviao
          await this.extornoRepository.query(alteraControleVoo, [reqNumerario[0].REQ_ID_CODIGO]);
          //Altera Controle do Aviao
          const autoriza = await this.extornoRepository.query(selecionaAutoriza, [
            reqNumerario[0].REQ_ID_CODIGO,
          ]);
          const total = autoriza.length + 1;

          await this.extornoRepository.query(insertAutoriza, [
            reqNumerario[0].REQ_ID_CODIGO,
            user.chapa,
            total,
            DataUtils.formatarDataAtualString(),
          ]);
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
