import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FuncSalarioEntity } from '../database/db_oracle/entities/funcsalario.entity';
import { FindAllParams } from './funcsalarioDto';
import { SaquesMesService } from '../saques-mes/saques-mes.service';



@Injectable()
export class FuncsalarioService {
  constructor(
    @InjectRepository(FuncSalarioEntity, 'oracleConnection')
    private funcSalarioRepository: Repository<FuncSalarioEntity>   
  ) {}

  async findAll(params: FindAllParams): Promise<FuncSalarioEntity[]> {
    const searchParams: FindOptionsWhere<FuncSalarioEntity> = {};
  
    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }

    if (params.chapa) {
      searchParams['chapa'] = params.chapa;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.funcSalarioRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.funcSalarioRepository.find({
      where: searchParams,
    });
  }

  async findByCodigo(chapa: string): Promise<any> {
   
    const pfuncao = await this.funcSalarioRepository.query(`
    Select * From FINANCEIRO.V009_FUNCSALARIO Where Chapa = :chapa
      `,[chapa]);    
       
    if (pfuncao?.length === 0) {
      const outros = await this.findOutros(chapa);
      if (outros.length > 0) {
        return outros[0];
      }
      return null;
    }
    return pfuncao[0];
  }

  async findOutros(chapa: string) {
    const funcs = await this.funcSalarioRepository.query(
      `
      Select A.Chapa, A.Codsecao, C.NOME, d.nome as Funcao, a.codfuncao, d.cargo, a.salario ,
        e.descricao As Setor, e.reg_id_codigo, e.reg_descricao
      From Rm.Pfunc A, Rm.Ppessoa C, Rm.Pfuncao D, Financeiro.V009_SetorRegional E
      Where A.Codpessoa = C.Codigo and
      A.Codfuncao = d.codigo and      
      A.Codsecao = e.codigo  
      AND A.Chapa = :chapa
      `,
      [chapa],
    );
    return funcs;
  }

 
}
