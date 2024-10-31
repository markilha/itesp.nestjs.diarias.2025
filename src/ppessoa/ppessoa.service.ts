import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
import { PFuncEntity } from 'src/database/db_oracle/entities/pfunc.entity';
import { Repository } from 'typeorm';
import { FindAllParams, RMPessoaDto } from './ppessoa.dto';
import { FuncionarioDto, returnRmDto } from './returnRmDto';

@Injectable()
export class PpessoaService {
  constructor(
    @InjectRepository(PPessoaEntity, 'oracleConnection')
    private rmRepository: Repository<PPessoaEntity>,

    @InjectRepository(PFuncEntity, 'oracleConnection')
    private funcRepository: Repository<PFuncEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<FuncionarioDto> {
    try {
      const query = `    
      SELECT
        a.CHAPA as CHAPA,
        UPPER(a.NOME) as NOME,
        a.DESCFUNC as DESCFUNC,
        b.CPF as CPF
      FROM FINANCEIRO.V001_PFUNC a 
      INNER JOIN RM.ppessoa b ON a.CHAPA = b.CODUSUARIO
      WHERE a.CHAPA = :chapa           
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
