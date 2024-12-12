import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extornoEntity } from '../database/db_oracle/entities/extorno.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, extornoDto, upateExtornoDto } from './extornoDto';
import { DataUtils } from '../util/DataUtils';
import { SaqueService } from '../saque/saque.service';
import { selecionaReqNumerario } from '../util/selects/reqNumerario';
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
      const searchParams: FindOptionsWhere<extornoDto> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.extornoRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.extornoRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneOrFail(SQE_ID_CODIGO: number): Promise<extornoDto> {
    try {
      const result = await this.extornoRepository.findOneOrFail({
        where: {
          SQE_ID_CODIGO,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('Extorno não encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(extorno: extornoDto) {
    try {
      return await this.extornoRepository.save(this.extornoRepository.create(extorno));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(ex: upateExtornoDto) {
    try {
      const extorno = await this.extornoRepository.findOneOrFail({
        where: { SQE_ID_CODIGO: ex.SQE_ID_CODIGO, PCO_ID_CODIGO: ex.PCO_ID_CODIGO },
      });
      this.extornoRepository.merge(extorno, ex);
      return await this.extornoRepository.save(extorno);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async extornoViagemNaoRealizada(dados: extornoDto, user: AuthUserDto) {
    try {
      const where = `And B.SQE_ID_CODIGO=:NSaque`;
      const reqNumerario = await this.extornoRepository.query(`${selecionaReqNumerario} ${where}`, [
        dados.SQE_ID_CODIGO,
      ]);
      verificaAutorizacao(reqNumerario[0].CHAPA, user);

      const dataViagem = DataUtils.formatarDataAtualString();
      const saque = await this.saqueService.findOne(dados.SQE_ID_CODIGO);

      const extorno = new extornoDto({
        SQE_ID_CODIGO: dados.SQE_ID_CODIGO,
        ITE_ID_CODIGO: saque.iteIdCodigo,
        RRE_ID_CODIGO: saque.rreIdCodigo,
        DIR_ID_CODIGO: saque.dirIdCodigo,
        PCO_ID_CODIGO: 1,
        FPA_ID_CODIGO: saque.fpaIdCodigo,
        EXT_VALOR: dados.EXT_VALOR,
        EXT_DATA: dataViagem,
        EXT_JUSTIFICA: dados.EXT_JUSTIFICA,
      });
      //06/10/2005 15:19:38
      //update data saque da tabela saque
      await this.saqueService.updateDataPrestacao(dados.SQE_ID_CODIGO, dataViagem);
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
