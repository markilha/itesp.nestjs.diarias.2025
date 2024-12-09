import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from '../database/db_oracle/entities/ppessoa.entity';
import { Repository } from 'typeorm';
import { FindAllParams } from './ppessoa.dto';
import { FuncionarioDto, supervisorDto } from './returnRmDto';
import {
  SelecionaChefe,
  SelecionaDiretoriaGeral,
  SelecionaSubordina1,
  SelecionaSubordina2,
} from '../util/selects/diretoria';
import { selecionaPefilFunc } from '../util/selects/pfunc';
import { permissaoCargo } from 'src/util/enums/cargo';

@Injectable()
export class PpessoaService {
  constructor(
    @InjectRepository(PPessoaEntity, 'oracleConnection')
    private rmRepository: Repository<PPessoaEntity>,
  ) {}

  async find(params: FindAllParams): Promise<FuncionarioDto> {
    try {
      const consulta = await this.rmRepository.query(selecionaPefilFunc, [params.chapa]);

      if (consulta.length === 0) {
        throw new HttpException('Funcionário não encontrado!!!', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const where = `and A.CODSECAO = :codsecao`;

      const selecionadaChefe = await this.rmRepository.query(`${SelecionaChefe} ${where}`, [
        consulta[0].CODSECAO,
      ]);

      const diretoria = await this.rmRepository.query(
        `${SelecionaDiretoriaGeral} WHERE A.DIR_ID_CODIGO = :DIR_ID_CODIGO`,
        [consulta[0].DIR_ID_CODIGO],
      );

      const PERMISSAO = await this.DetalhePermissao(params.chapa, consulta[0].CODSECAO);

      const funcionario = new FuncionarioDto({
        NOME: consulta[0].NOME,
        CPF: consulta[0].CPF,
        DESCFUNC: consulta[0].DESCFUNC,
        CHAPA: consulta[0].CHAPA,
        REG_ID_CODIGO: consulta[0].REG_ID_CODIGO,
        DTNASCIMENTO: consulta[0].DTNASCIMENTO,
        ENDERECO: `${consulta[0].RUA}, ${consulta[0].NUMERO}, ${consulta[0].CEP}, ${consulta[0].BAIRRO}, ${consulta[0].CIDADE} - ${consulta[0].ESTADO}`,
        EMAIL: consulta[0].EMAIL,
        TELEFONE: consulta[0].TELEFONE,
        ORGAO: 'FUNDAÇÃO INSTITUTO DE TERRAS DO ESTADO DE SÃO PAULO',
        GTC: consulta[0].DIRETORIA,
        DIRETORIA: diretoria[0].DESCRICAO,
        REG_DESCRICAO: consulta[0].REG_DESCRICAO,
        NME_MUNIC: consulta[0].CIDADE,
        SUPERVISOR: selecionadaChefe[0]?.NOME,
        CODIGO: consulta[0].CODIGO,
        CODSECAO: consulta[0].CODSECAO,
        DIR_ID_CODIGO: consulta[0].DIR_ID_CODIGO,
        PERMISSAO,
      });

      return funcionario;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //findOne pelo codusuaril
  async findOne(chapa: string): Promise<PPessoaEntity> {
    const rm = await this.rmRepository.findOneOrFail({
      where: { codusuario: chapa },
    });
    return rm;
  }

  async DetalhePermissao(chapa: string, CODSECAO: string): Promise<number> {
    // Verifica se é chefe (Assessor, Assistente, Chefe de Gabinete, Diretor)
    //Verifica se o chefe
    const where = `AND c.codigo IN (1,2,5,7,3,4,9) AND B.CHAPA=:NCHAPA`;
    const chefe = await this.rmRepository.query(`${SelecionaChefe} ${where}`, [chapa]);

    if (chefe.length > 0) {
      const codigo = chefe[0].CODIGO;
      switch (codigo) {
        case '01':          
          return permissaoCargo.DIRETOR_EXECUTIVO; // Diretor Executivo
        case '02':
          return permissaoCargo.DIRETOR_ADJUNTO; // Diretor Adjunto
        case '03':
          return permissaoCargo.CHEFE_GABINETE; // Chefe de Gabinete
        case '07':
          return permissaoCargo.ASSISTENTE; // Assistente
        case '04':
          return permissaoCargo.GERENTE; // Gerente
        case '05':
          return permissaoCargo.ASSESSORIA_OUVIDORIA; // Assessoria/Ouvidor
        case '09':
          return permissaoCargo.ASSESSORIA_OUVIDORIA; // Assessoria/Ouvidor
        default:
          break;
      }
    } else {
      // Não é chefe
      const where = `AND c.codigo NOT IN (1,2,5,7,3,4,9) AND B.CHAPA=:NCHAPA`;
      const chefeNaoCodigo = await this.rmRepository.query(`${SelecionaChefe} ${where}`, [chapa]);

      if (chefeNaoCodigo.length > 0) {     

        // Verifica se é responsável Técnico
        const where = `and A.CODIGO=:SETOR`;
        const subordina2 = await this.rmRepository.query(`${SelecionaSubordina2} ${where}`, [
          CODSECAO,
        ]);

        if (subordina2.length > 0) {
          const subCodigo = subordina2[0].CODIGO;
          if (subCodigo === '1.2.01.06.01.03.00') {
            return permissaoCargo.RESP_TEC_TRANSPORTE; // Resp. Tec do Transporte
          } else if (subCodigo === '1.2.01.06.02.05.00') {
            return permissaoCargo.RESP_TEC_ORCAMENTO; // Resp. Técnico Orçamento
          } else {
            return permissaoCargo.RESP_TECNICO; // Resp. Técnico
          }
        } else if (CODSECAO.startsWith('1.2')) {
          return permissaoCargo.FINANCEIRO_INTERIOR; // Resp. Grupo Tec. Campo DA
        } else {
          return permissaoCargo.GTCAMPO; // Resp. Grupo Tec. Campo
        }
      } else {
        // Funcionário Nível 1 ou 2
        const where = `and A.CODIGO=:CODSECAO`;
        const subordina1 = await this.rmRepository.query(`${SelecionaSubordina1} ${where}`, [
          CODSECAO,
        ]);

        if (subordina1.length > 0) {
          if (CODSECAO.startsWith('1.2')) {
            return permissaoCargo.TESOURARIA_INTERIOR; // Grupo Tec. Campo DA
          } else {
            return permissaoCargo.USUARIO_NIVEL1; // Usuário Nível 1
          }
        } else {
          const where = `and A.CODIGO=:SETOR`;
          const subordina2 = await this.rmRepository.query(`${SelecionaSubordina2} ${where}`, [
            CODSECAO,
          ]);

          if (subordina2.length > 0 && subordina2[0].TSB2_ID_CODIGO === 1) {
            return permissaoCargo.APOIO; // Apoio
          } else if (CODSECAO === '1.2.01.06.02.06.00') {
            return permissaoCargo.TESOURARIA_SEDE; // Tesouraria
          } else if (CODSECAO === '1.2.01.06.02.05.00') {
            return permissaoCargo.ORCAMENTO; // Orçamento
          } else {
            return permissaoCargo.USUARIO_NIVEL1; // Funcionário Nível 2
          }
        }
      }
    }
  }
}
