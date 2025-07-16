import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FuncionarioEntity } from '../database/db_oracle/entities/funcionario.entity';
import { FindAllFuncionariosDto } from './funcionariosDto';

@Injectable()
export class FuncionariosService {
  constructor(
    @InjectRepository(FuncionarioEntity, 'oracleConnection')
    private readonly funcionarioRepository: Repository<FuncionarioEntity>,
  ) { }

  async findAll(params: FindAllFuncionariosDto): Promise<FuncionarioEntity[]> {
    const searchParams: FindOptionsWhere<FuncionarioEntity> = {};

    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }

    if (params.chapa) {
      searchParams['chapa'] = params.chapa;
    }

    if (params.page && params.limit) {
      const skip = (params.page - 1) * params.limit;

      return await this.funcionarioRepository.find({
        where: searchParams,
        skip,
        take: params.limit,
      });
    }

    return await this.funcionarioRepository.find({
      where: searchParams,
    });
  }

  async findByChapa(chapa: string): Promise<any> {
    const resultado = await this.funcionarioRepository.query(
      `SELECT * FROM FINANCEIRO.V_FUNCIONARIO WHERE CHAPA = :chapa`,
      [chapa],
    );

    if (!resultado || resultado.length === 0) {
      const fallback = await this.findFromFallbackQuery(chapa);
      return fallback.length > 0 ? fallback[0] : null;
    }

    return resultado[0];
  }

  async findFromFallbackQuery(chapa: string): Promise<any[]> {
    return await this.funcionarioRepository.query(
      `
      SELECT 
        A.Chapa, A.Codsecao, C.NOME, D.nome AS Funcao, A.codfuncao, D.cargo, 
        A.salario, E.descricao AS Setor, E.reg_id_codigo, E.reg_descricao
      FROM 
        Rm.Pfunc A
        JOIN Rm.Ppessoa C ON A.Codpessoa = C.Codigo
        JOIN Rm.Pfuncao D ON A.Codfuncao = D.codigo
        JOIN Financeiro.V009_SetorRegional E ON A.Codsecao = E.codigo
      WHERE 
        A.Chapa = :chapa
      `,
      [chapa],
    );
  }

  async findFuncionarioDetalhado(chapa: string): Promise<any> {
    const result = await this.funcionarioRepository.query(
      `
    SELECT 
      *
    FROM 
      Rm.Pfunc A,
      Rm.Ppessoa C,
      Financeiro.V009_SetorRegional E,
      Rm.Pfuncao D,
      comum.S000_MUNREG F        
    WHERE 
      A.Codpessoa = C.Codigo 
      AND A.Codsecao = E.codigo 
      AND A.Codfuncao = D.codigo
      AND E.REG_ID_CODIGO = F.REG_ID_CODIGO     
      AND A.CHAPA = :chapa
    `,
      [chapa],
    );

    return result?.[0] ?? null;
  }
}