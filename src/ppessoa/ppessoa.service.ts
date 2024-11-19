import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from '../database/db_oracle/entities/ppessoa.entity';
import { Repository } from 'typeorm';
import { FindAllParams, } from './ppessoa.dto';
import { FuncionarioDto, returnRmDto } from './returnRmDto';

@Injectable()
export class PpessoaService {
  constructor(
    @InjectRepository(PPessoaEntity, 'oracleConnection')
    private rmRepository: Repository<PPessoaEntity>,  
  ) {}

  async find(params: FindAllParams): Promise<FuncionarioDto> {
    try {
      const query = `
      SELECT 
        A.CHAPA as CHAPA,
        UPPER(C.NOME) as NOME,
        C.CPF as CPF,
        D.NOME as DESCFUNC,
        E.REG_ID_CODIGO as REG_ID_CODIGO
      FROM Rm.Pfunc A, Rm.Ppessoa C, Financeiro.V009_SetorRegional E,Rm.Pfuncao D
      WHERE A.Codpessoa = C.Codigo 
      AND A.Codsecao = E.codigo 
      AND  A.Codfuncao = d.codigo
      AND A.CHAPA = :chapa
      `;

      const consulta = await this.rmRepository.query(query, [params.chapa]);

      if (consulta.length === 0) {
        throw new HttpException('Funcionário não encontrado!!!', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const funcionario = new FuncionarioDto({
        CHAPA: consulta[0].CHAPA,
        NOME: consulta[0].NOME,
        CPF: consulta[0].CPF,
        DESCFUNC: consulta[0].DESCFUNC,
        ORGAO: 'FUNDAÇÃO INSTITUTO DE TERRAS DO ESTADO DE SÃO PAULO',
        REG_ID_CODIGO: consulta[0].REG_ID_CODIGO,
      });

      return funcionario;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //findOne pelo codusuaril
  async findOne(chapa: string): Promise<returnRmDto> {
    const rm = await this.rmRepository.findOne({
      where: { codusuario: chapa },
    });
    return new returnRmDto(rm);
  }
}
