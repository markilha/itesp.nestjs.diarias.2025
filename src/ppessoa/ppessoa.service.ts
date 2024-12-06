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
import { Cargo, PermissaoCargo } from 'src/util/enums/cargo';

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
        CODSECAO: consulta[0].CODSECAO,
        DIR_ID_CODIGO: consulta[0].DIR_ID_CODIGO,
        PERMISSAO
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

  async DetalhePermissao(chapa: string, codigo): Promise<number> {
    //Verifica se o chefe
    const where = `AND c.codigo IN (1,2,5,7,3,4,9) AND B.CHAPA=:NCHAPA`;
    const selecinachefe = await this.rmRepository.query(`${SelecionaChefe} ${where}`, [chapa]);

    if (selecinachefe.length > 0) {
      if (selecinachefe[0].CODIGO === Cargo.DiretorExecutivo) {
        return 11; // Diretor Executivo
      } else if (selecinachefe[0].CODIGO === Cargo.DiretorAdjunto) {
        return 1; // Diretor Adjunto
      } else if (selecinachefe[0].CODIGO === Cargo.ChefeGabinete) {
        return 12; // Chefe Gabinete
      } else if (selecinachefe[0].CODIGO === Cargo.Gerente) {
        return 3; // gerente
      } else if (
        selecinachefe[0].CODIGO === Cargo.AssessorChefe ||
        selecinachefe[0].CODIGO === Cargo.Ouvidor
      ) {
        return 5; // Assessoria/Ouvidor
      }
    } else {
      const where = `AND c.codigo NOT IN (1,2,5,7,3,4,9) AND B.CHAPA=:NCHAPA`;
      const selecionachefe = await this.rmRepository.query(`${SelecionaChefe} ${where}`, [chapa]);

      if (selecionachefe.length > 0) {
        const where = `and A.CODIGO=:SETOR`;
        const subordina2 = await this.rmRepository.query(`${SelecionaSubordina2} ${where}`, [
          codigo,
        ]);
        if (subordina2.length > 0) {
          if (subordina2[0].CODIGO === '1.2.01.06.01.03.00') {
            return 6; // Resp. Tec do Transporte
          } else if (subordina2[0].CODIGO === '1.2.01.06.02.05.00') {
            return 16; // Resp. Tec do Transporte
          } else {
            return 7; // Resp. Técnico
          }
        } else if (codigo.startsWith('1.2')) {
          return 14; // Resp. Grupo Tec. Campo DA
        } else {
          return PermissaoCargo.GrupoTecCampo; // Resp. Grupo Tec. Campo
        }
      } else {
        if (selecionachefe.length === 0) {
          const where = `and A.CODIGO=:CODSECAO`;
          const subordina1 = await this.rmRepository.query(`${SelecionaSubordina1} ${where}`, [
            codigo,
          ]);

          if (subordina1.length > 0) {
            if (codigo.startsWith('1.2')) {
              return 15; // Grupo Tec. Campo DA
            } else {
              return 8; // Usuário Nível 1
            }
          } else {
            const where = `and A.CODIGO=:SETOR`;
            const subordina2 = await this.rmRepository.query(`${SelecionaSubordina2} ${where}`, [
              codigo,
            ]);
            if (subordina2.length > 0) {
              if (subordina2[0].TSB2_ID_CODIGO === 1) {
                return 10; //apoio
              } else if (codigo === '1.2.01.06.02.06.00') {
                return 13;// Tesouraria
              } else if (codigo === '1.2.01.06.02.05.00') {
                return 17; // Funcionário do Orçamento
              } else {
                return 8;
              }
            }
          }
        }
      }
    }

    return codigo;
  }
}
