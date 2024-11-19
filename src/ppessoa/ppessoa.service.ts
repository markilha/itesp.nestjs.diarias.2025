import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from '../database/db_oracle/entities/ppessoa.entity';
import { Repository } from 'typeorm';
import { FindAllParams } from './ppessoa.dto';
import { FuncionarioDto, returnRmDto } from './returnRmDto';
import { endOfDecade } from 'date-fns';

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
        C.DTNASCIMENTO as DTNASCIMENTO,
        C.RUA as RUA,
        C.NUMERO as NUMERO,
        C.CEP as CEP,
        C.BAIRRO as BAIRRO,
        C.CIDADE as CIDADE,
        C.ESTADO as ESTADO,
        C.EMAIL as EMAIL,
        C.TELEFONE1 as TELEFONE,       
        E.DESCRICAO as DIRETORIA,
        E.REG_DESCRICAO as REG_DESCRICAO,        
        D.NOME as DESCFUNC,        
        E.REG_ID_CODIGO as REG_ID_CODIGO  
      FROM 
        Rm.Pfunc A,
        Rm.Ppessoa C,
        Financeiro.V009_SetorRegional E,
        Rm.Pfuncao D,
        comum.S000_MUNREG F        
      WHERE A.Codpessoa = C.Codigo 
      AND A.Codsecao = E.codigo 
      AND  A.Codfuncao = d.codigo
      AND E.REG_ID_CODIGO = F.REG_ID_CODIGO     
      AND A.CHAPA = :chapa
      `;

      const consulta = await this.rmRepository.query(query, [params.chapa]);
      
      

      if (consulta.length === 0) {
        throw new HttpException('Funcionário não encontrado!!!', HttpStatus.INTERNAL_SERVER_ERROR);
      }

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
        DIRETORIA: consulta[0].DIRETORIA,
        REG_DESCRICAO: consulta[0].REG_DESCRICAO,
        NME_MUNIC: consulta[0].CIDADE,   
      });

      return funcionario;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //findOne pelo codusuaril
  async findOne(chapa: string): Promise<FuncionarioDto> {
    const rm = await this.rmRepository.find({
      where: { codusuario: chapa },
    });
    return new FuncionarioDto(rm);
  }
}
