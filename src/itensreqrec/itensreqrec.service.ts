import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';
import { Repository } from 'typeorm';
import { itemRecursoDto, paramsItemRecurso } from './itensreq.Dto';

import { AuthUserDto } from '../auth/use.auth.Dto';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';
import { permissaoFindAll } from '../util/permissao/permissao';

@Injectable()
export class itensreqrecService {
  constructor(
    @InjectRepository(itensreqrecEntity, 'oracleConnection')
    private itensreqrecRepository: Repository<itensreqrecEntity>,
  ) {}

  async create(data: Partial<itensreqrecEntity>): Promise<itensreqrecEntity> {
    try {
      const item = await this.itensreqrecRepository.create(data);
      return await this.itensreqrecRepository.save(item);
    } catch (error) {
      throw new HttpException('Ocorreu erro ao criar item recurso', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(ITE_ID_CODIGO: number) {
    try {
      const item = await this.itensreqrecRepository.query(
        `SELECT 
        i.*,
        s.STS_DESCRICAO ,
        d.TDE_DESCRICAO,
        f.NOME,
        re.PRA_ID_CODIGO,
        p.PRA_ATIVO     
        FROM FINANCEIRO.S009_ITENSREQREC i
        LEFT JOIN RM.PFUNC f ON f.CHAPA = i.CHAPA 
        LEFT JOIN FINANCEIRO.S009_STATUS s ON s.STS_ID_CODIGO = i.STS_ID_CODIGO 
        LEFT JOIN FINANCEIRO.S009_REQRECURSOS re ON re.DIR_ID_CODIGO  = i.DIR_ID_CODIGO 
        LEFT JOIN FINANCEIRO.S009_PRAZOS p ON p.PRA_ID_CODIGO = re.PRA_ID_CODIGO
        LEFT JOIN FINANCEIRO.S009_TIPODESP d ON d.TDE_ID_CODIGO = i.TDE_ID_CODIGO
        WHERE ITE_ID_CODIGO = :ITE_ID_CODIGO`,
        [ITE_ID_CODIGO],
      );

      if (!item || item.length === 0) {
        throw new HttpException(
          `Item com código: ${ITE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return item[0];
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar o item com código: ${ITE_ID_CODIGO}. ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async selecionaItensRecurso(params: paramsItemRecurso, user: AuthUserDto): Promise<any> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const queryBuilder = this.itensreqrecRepository
        .createQueryBuilder('A')
        .select([
          'A.ITE_ID_CODIGO as ITE_ID_CODIGO',
          'A.RRE_ID_CODIGO as RRE_ID_CODIGO',
          'A.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'A.ORI_ID_CODIGO as ORI_ID_CODIGO',
          'A.FPA_ID_CODIGO as FPA_ID_CODIGO',
          'A.STS_ID_CODIGO as STS_ID_CODIGO',
          'A.TDE_ID_CODIGO as TDE_ID_CODIGO',
          'A.CHAPA as CHAPA',
          'A.CODCOLIGADA as CODCOLIGADA',
          'A.IRR_VALOR_SOL as IRR_VALOR_SOL',
          'A.IRR_DATA_SOL as IRR_DATA_SOL',
          'A.IRR_VALOR_CONC as IRR_VALOR_CONC',
          'A.IRR_DATA_CONC as IRR_DATA_CONC',
          'A.IRR_VALOR_PREST as IRR_VALOR_PREST',
          'A.IRR_DATA_PREST as IRR_DATA_PREST',
          'A.IRR_JUSTIFICA as IRR_JUSTIFICA',
          'A.IRR_RECURSO as IRR_RECURSO',
          'A.IRR_VALOR_AUT as IRR_VALOR_AUT',
          'A.IRR_VLRECEBIDO as IRR_VLRECEBIDO',
          'A.IRR_VLDEVOLUCAO as IRR_VLDEVOLUCAO',
          'A.IRR_VLSAQUE as IRR_VLSAQUE',
          'A.IRR_VLTRANSFERIDO as IRR_VLTRANSFERIDO',
          'A.IRR_SALDO as IRR_SALDO',
          'A.NOME as NOME',
          'A.CODSECAO as CODSECAO',
          'A.DESCRICAO as DESCRICAO',
          'A.TDE_DESCRICAO as TDE_DESCRICAO',
          'A.RRE_DATA as RRE_DATA',
          'A.RRE_DATAFIMPROC as RRE_DATAFIMPROC',
          'A.PRA_INICIO_RECURSO as PRA_INICIO_RECURSO',
          'A.PRA_FIM_RECURSO as PRA_FIM_RECURSO',
          'A.IRR_COMPLEMENTO as IRR_COMPLEMENTO',
          'A.PRA_ATIVO as PRA_ATIVO',
          'A.PRA_ID_CODIGO as PRA_ID_CODIGO',
          'A.STS_DESCRICAO as STS_DESCRICAO',
          'B.DESCRICAO AS DIRETORIA',
          'A.IRR_VLREGIONAL as IRR_VLREGIONAL',
        ])
        .innerJoin('V001_DIRETORIA', 'B', 'A.DIR_ID_CODIGO = B.DIR_ID_CODIGO');

      if (params.RRE_ID_CODIGO) {
        queryBuilder.where('A.RRE_ID_CODIGO = :codigo', { codigo: params.RRE_ID_CODIGO });
      } else {
        const per = permissaoFindAll(user.permissao);
        if (per) {
          queryBuilder.where('A.CODSECAO LIKE :codsecao', {
            codsecao: `${user.codsecao.substring(0, per)}%`,
          });
        } else if (params.CHAPA) {
          queryBuilder.where('A.CHAPA = :chapa', { chapa: user.chapa });
        }
      }

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);

      const parameters = Object.values(queryBuilder.getParameters());

      const result = await this.itensreqrecRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.error('Erro ao buscar itens recurso', error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Ocorreu erro ao buscar itens recurso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(newItem: any): Promise<itemRecursoDto> {
    const { ITE_ID_CODIGO } = newItem;

    const newitensRecurso = new itemRecursoDto({
      ITE_ID_CODIGO: newItem.ITE_ID_CODIGO,
      RRE_ID_CODIGO: newItem.RRE_ID_CODIGO,
      DIR_ID_CODIGO: newItem.DIR_ID_CODIGO,
      ORI_ID_CODIGO: newItem.ORI_ID_CODIGO,
      FPA_ID_CODIGO: newItem.FPA_ID_CODIGO,
      STS_ID_CODIGO: newItem.STS_ID_CODIGO,
      CHAPA: newItem.CHAPA,
      CODCOLIGADA: newItem.CODCOLIGADA,
      IRR_VALOR_SOL: newItem.IRR_VALOR_SOL,
      IRR_DATA_SOL: newItem.IRR_DATA_SOL,
      IRR_VALOR_CONC: newItem.IRR_VALOR_CONC,
      IRR_DATA_CONC: newItem.IRR_DATA_CONC,
      IRR_VALOR_PREST: newItem.IRR_VALOR_PREST,
      IRR_DATA_PREST: newItem.IRR_DATA_PREST,
      IRR_JUSTIFICA: newItem.IRR_JUSTIFICA,
      IRR_RECURSO: newItem.IRR_RECURSO,
      IRR_VALOR_AUT: newItem.IRR_VALOR_AUT,
      IRR_VLRECEBIDO: newItem.IRR_VLRECEBIDO,
      IRR_VLDEVOLUCAO: newItem.IRR_VLDEVOLUCAO,
      IRR_VLSAQUE: newItem.IRR_VLSAQUE,
      IRR_VLTRANSFERIDO: newItem.IRR_VLTRANSFERIDO,
      IRR_SALDO: newItem.IRR_SALDO,
      IRR_COMPLEMENTO: newItem.IRR_COMPLEMENTO,
      IRR_VLREGIONAL: newItem.IRR_VLREGIONAL,
      TDE_ID_CODIGO: newItem.TDE_ID_CODIGO,
    });
    try {
      // Busca o item existente
      const item = await this.findOne(ITE_ID_CODIGO);
      if (!item) {
        throw new HttpException(
          `Item com código: ${ITE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.itensreqrecRepository
        .createQueryBuilder()
        .update('FINANCEIRO.S009_ITENSREQREC')
        .set(newitensRecurso)
        .where('ITE_ID_CODIGO = :ITE_ID_CODIGO', { ITE_ID_CODIGO })
        .execute();

      return newitensRecurso;
    } catch (error) {
      console.error(`Erro ao atualizar o item com código: ${ITE_ID_CODIGO}`, error);
      throw new HttpException(
        `Erro ao atualizar o item com código: ${ITE_ID_CODIGO}. ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
