import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
import { PFuncEntity } from 'src/database/db_oracle/entities/pfunc.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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
    const query =   `
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

  const funcionario = new FuncionarioDto({
    CHAPA: consulta[0].CHAPA,
    NOME: consulta[0].NOME,
    CPF: consulta[0].CPF,
    DESCFUNC: consulta[0].DESCFUNC,
    ORGAO: 'FUNDAÇÃO INSTITUTO DE TERRAS DO ESTADO DE SÃO PAULO',
  });

  return funcionario;


  }

  // async findAll(params: FindAllParams): Promise<returnRmDto[]> {
  //   const searchParams: FindOptionsWhere<RMPessoaDto> = {};

  //   if (params.nome) {
  //     searchParams['nome'] = ILike(`%${params.nome}%`);
  //   }

  //   let rms: PPessoaEntity[];
  
  //   if (params.page && params.limit) {
  //     const page = params.page;
  //     const limit = params.limit;
  //     const skip = (page - 1) * limit;

  //     rms = await this.rmRepository.find({
  //       where: searchParams,
  //       skip,
  //       take: limit,
  //       relations: ['pfunc'],
  //     });
  //   } else {
  //     rms = await this.rmRepository.find({
  //       where: searchParams,
  //       relations: ['pfunc'],
  //     });
  //   }   

  //   return rms.map((rm) => new returnRmDto(rm));
  // }
  //findOne pelo codusuaril
  async findOne(chapa: string): Promise<returnRmDto> {
    const rm = await this.rmRepository.findOne({
      where: { codusuario:chapa }     
    });
    return new returnRmDto(rm);
  }

}
