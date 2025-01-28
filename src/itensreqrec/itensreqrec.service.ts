import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';
import { Repository } from 'typeorm';
import { paramsItemRecurso } from './itensreq.Dto';
import {
  SelecionaItenFunc,
  SelecionaItensFunc,
  SelecionaItensRecurso,
} from '../util/selects/itensRecurso';

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
      throw new HttpException(
        "Ocorreu erro ao criar item recurso",
        HttpStatus.NOT_FOUND,
      );
      
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
  

  async selecionaItensRecurso(params: paramsItemRecurso): Promise<any> {
    try {
      let where = '';
      let paramsWhere = [];

      if (params.RRE_ID_CODIGO) {
        where = SelecionaItenFunc;
        paramsWhere = [params.CHAPA, params.RRE_ID_CODIGO];
      } else {
        where = SelecionaItensFunc;
        paramsWhere = [params.CHAPA];
      }

      const result = await this.itensreqrecRepository.query(
        `${SelecionaItensRecurso} ${where}`,
        paramsWhere,
      );
      if (result.length > 0) {
        return result;
      } else {
        throw new HttpException('Nenhum item  encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Ocorreu erro ao buscar itens recurso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(newItem: itensreqrecEntity): Promise<itensreqrecEntity> {
    try {
      // Busca o item existente no banco de dados
      const item = await this.findOne(newItem.ITE_ID_CODIGO);
      if (!item) {
        throw new HttpException(
          `Item com código: ${newItem.ITE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }  
      const updatedItem = this.itensreqrecRepository.merge(item, newItem); 
      await this.itensreqrecRepository
        .createQueryBuilder()
        .update("FINANCEIRO.S009_ITENSREQREC")
        .set(updatedItem)
        .where("ITE_ID_CODIGO = :ITE_ID_CODIGO", { ITE_ID_CODIGO: newItem.ITE_ID_CODIGO })
        .execute();
      return updatedItem;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `Erro ao atualizar o item com código: ${newItem.ITE_ID_CODIGO}. ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  

}
