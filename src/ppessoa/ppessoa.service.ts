import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from '../database/db_oracle/entities/ppessoa.entity';
import { Repository } from 'typeorm';
import { FindAllParams } from './ppessoa.dto';
import { FuncionarioDto, supervisorDto } from './returnRmDto';
import { SelecionaChefe, SelecionaDiretoriaGeral } from '../util/selects/diretoria';
import { selecionaPefilFunc } from '../util/selects/pfunc';

@Injectable()
export class PpessoaService {
  constructor(
    @InjectRepository(PPessoaEntity, 'oracleConnection')
    private rmRepository: Repository<PPessoaEntity>   
  ) {}

  async find(params: FindAllParams): Promise<FuncionarioDto> {
    try {
      const consulta = await this.rmRepository.query(selecionaPefilFunc, [params.chapa]);
      const where = `and A.CODSECAO = :codsecao`;  

      if (consulta.length === 0) {
        throw new HttpException('Funcionário não encontrado!!!', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const selecionadaChefe = await this.rmRepository.query(
        `${SelecionaChefe} ${where}`, 
        [consulta[0].CODSECAO]
      );     
      
      const selChef = selecionadaChefe.map(
        (item:supervisorDto) => new supervisorDto({
          CHAPA: item.CHAPA,
          NOME: item.NOME,
          CODBANCOPAGTO: item.CODBANCOPAGTO,
          CODAGENCIAPAGTO: item.CODAGENCIAPAGTO,
          CONTAPAGAMENTO: item.CONTAPAGAMENTO,
          CODSECAO: item.CODSECAO,
          CODIGO: item.CODIGO,
        })
      );

      const diretoria = await this.rmRepository.query(`${SelecionaDiretoriaGeral} WHERE A.DIR_ID_CODIGO = :DIR_ID_CODIGO`, [consulta[0].DIR_ID_CODIGO]);
      

      const funcionario = new FuncionarioDto({
        NOME: consulta[0].NOME ,
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
        SUPERVISOR: selChef[0].NOME,
        CODSECAO: consulta[0].CODSECAO,
        DIR_ID_CODIGO: consulta[0].DIR_ID_CODIGO,
      
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
}
