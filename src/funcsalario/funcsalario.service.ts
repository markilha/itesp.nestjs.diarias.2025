import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FuncSalarioEntity } from '../database/db_oracle/entities/funcsalario.entity';
import { FindAllParams, FindParamsDadosPagamentoDto, returnFunPagDto } from './funcsalarioDto';
import { formatDateToYYMM } from 'src/util/formatoYYMM';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';
import { DataUtils } from 'src/util/DataUtils';

@Injectable()
export class FuncsalarioService {
  constructor(
    @InjectRepository(FuncSalarioEntity, 'oracleConnection')
    private funcSalarioRepository: Repository<FuncSalarioEntity>,
    private SaquesMesService: SaquesMesService,
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

  async findByCodigo(chapa: string): Promise<FuncSalarioEntity> {
    const pfuncao = await this.funcSalarioRepository.findOne({
      where: { chapa: chapa },
    });

    // Se não encontrar, lança uma exceção 404
    if (!pfuncao) {
      const outros = await this.findOutros(chapa);
      if (outros.length > 0) {
        return outros[0];
      }
      throw new NotFoundException(`Funcionário com a chapa ${chapa} não foi encontrado`);
    }

    return pfuncao;
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

  async dadosPagamento(params: FindParamsDadosPagamentoDto): Promise<returnFunPagDto> {  

    const dataNow =  params.dataAtual ? params.dataAtual : new Date();   

    try {      
      const dados = await this.funcSalarioRepository.query(
        `
      SELECT 
        A.CHAPA,
        A.CODBANCOPAGTO,
        A.CODAGENCIAPAGTO,
        A.CONTAPAGAMENTO,
        D.SALARIO 
      FROM   
        RM.PFUNC A,
        RM.PSECAO B,
        RM.PFUNCAO C,
        FINANCEIRO.V009_FUNCSALARIO D
      Where 
        A.CODSECAO = B.CODIGO 
      AND 
        A.CODFUNCAO = C.CODIGO 
      AND 
        A.CHAPA = D.CHAPA 
      AND	
        A.CHAPA = :chapa
          `,
        [params.chapa],
      );

      if (dados.length === 0) {
        throw new NotFoundException(`Funcionário com a chapa ${params.chapa} não foi encontrado`);
      }    

      let consulta = await Promise.all(
        dados.map(async (item: returnFunPagDto) => {
          const formatoYYMM = formatDateToYYMM(dataNow);
          const saqueSalario = await this.SaquesMesService.findOne(item.CHAPA, formatoYYMM);
          const devolucaoMes = await this.SaquesMesService.findDevolucaoMes(item.CHAPA, formatoYYMM);    
          const transferenciaMes = await this.SaquesMesService.findTransferenciaMes(item.CHAPA, formatoYYMM);     

          const saqueMes = Number(saqueSalario[0]?.TotalSaqueMes) || 0;
          const salario50 = (item.SALARIO * 0.5) || 0;         
          const saldoDisponivel = (salario50 - saqueMes) || 0;  
          const vltransferencia = transferenciaMes[0]?.VLTOTAL || 0;       
          
          
          item.SALARIO_50 = salario50 || 0;
          item.SAQUE_MES = saqueMes;
          item.SALDO_DISPONIVEL = DataUtils.arredondar(saldoDisponivel);
          item.TOTAL_DEVOLUCAO = devolucaoMes[0]?.VLDEVOLUCAO || 0;
          item.TOTAL_TRANSFERENCIA = DataUtils.arredondar(vltransferencia);
          
          return new returnFunPagDto(item);
        })
      );

      return consulta[0];       
  
    } catch (error) {
      throw new NotFoundException(`Funcionário com a chapa ${params.chapa} não foi encontrado`);      
    }

  }
}
