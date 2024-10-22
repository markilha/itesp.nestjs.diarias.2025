import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotivodiariaEntity } from 'src/database/db_oracle/entities/motivoDiaria.entity';

import { Repository } from 'typeorm';
import { FindAllParams, motivoDiariaDto } from './motivodiariaDto';
import { tabsOracle } from 'src/util/variaveis/tabs';

@Injectable()
export class MotivodiariaService {
  constructor(
    @InjectRepository(MotivodiariaEntity, 'oracleConnection')
    private mDiariaRepository: Repository<MotivodiariaEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<motivoDiariaDto[]> {
    try {
      const query = this.mDiariaRepository
        .createQueryBuilder('A')
        .select([
          'A.MDI_ID_CODIGO',
          'A.ITE_ID_CODIGO',
          'A.RRE_ID_CODIGO',
          'A.DIR_ID_CODIGO',
          'A.MDI_TIPO',
          'A.MDI_VALOR',
          'A.MDI_CHEFE',
          'A.MDI_GERENTE',
          'A.MDI_DIRETOR',
          'A.MDI_DIREXECUTIVO',
          'A.MDI_DTAUTORIZA',
          'A.MDI_JUSTIFICATIVA',
          'B.CHAPA',
          'B.TDE_ID_CODIGO',
          'C.REQ_ID_CODIGO',
          'C.REQ_DTSAIDA',
          'C.REQ_HSAIDA',
          'C.REQ_DTRET',
          'C.REQ_HRET',
          'C.REQ_KM',
          'C.REQ_INTEGRAL',
          'C.REQ_PARCIAL',
          'C.REQ_ESPECIAL',
          'D.TRA_DESCRICAO',
          'C.REQ_MOTIVO',
          'C.REQ_GOVERNADOR',
        ])        
        .innerJoin("FINANCEIRO.S009_ITENSREQREC", "B", "A.ITE_ID_CODIGO = B.ITE_ID_CODIGO")
        .innerJoin("TRANSPORTE.S001_Requisicao", "C", "A.REQ_ID_CODIGO = C.REQ_ID_CODIGO")
        .innerJoin("TRANSPORTE.S001_Transmeio", "D", "C.TRA_ID_CODIGO = D.TRA_ID_CODIGO")
        .where("B.TDE_ID_CODIGO = :tdeId", { tdeId:7 })

    //   const sql = `
    //   SELECT 
    //       "A"."MDI_ID_CODIGO" AS "A_MDI_ID_CODIGO", 
    //       "A"."ITE_ID_CODIGO" AS "A_ITE_ID_CODIGO", 
    //       "A"."RRE_ID_CODIGO" AS "A_RRE_ID_CODIGO", 
    //       "A"."DIR_ID_CODIGO" AS "A_DIR_ID_CODIGO", 
    //       "A"."MDI_TIPO" AS "A_MDI_TIPO", 
    //       "A"."MDI_VALOR" AS "A_MDI_VALOR", 
    //       "A"."MDI_CHEFE" AS "A_MDI_CHEFE", 
    //       "A"."MDI_GERENTE" AS "A_MDI_GERENTE", 
    //       "A"."MDI_DIRETOR" AS "A_MDI_DIRETOR", 
    //       "A"."MDI_DIREXECUTIVO" AS "A_MDI_DIREXECUTIVO", 
    //       "A"."MDI_DTAUTORIZA" AS "A_MDI_DTAUTORIZA", 
    //       "A"."MDI_JUSTIFICATIVA" AS "A_MDI_JUSTIFICATIVA", 
    //       B.CHAPA, 
    //       B.TDE_ID_CODIGO, 
    //       C.REQ_ID_CODIGO, 
    //       C.REQ_DTSAIDA, 
    //       C.REQ_HSAIDA, 
    //       C.REQ_DTRET, 
    //       C.REQ_HRET, 
    //       C.REQ_KM, 
    //       C.REQ_INTEGRAL, 
    //       C.REQ_PARCIAL, 
    //       C.REQ_ESPECIAL, 
    //       D.TRA_DESCRICAO, 
    //       C.REQ_MOTIVO, 
    //       C.REQ_GOVERNADOR 
    //   FROM 
    //       "FINANCEIRO"."S009_MOTIVODIARIA" "A" 
    //   INNER JOIN 
    //       "FINANCEIRO".S009_ITENSREQREC "B" ON "A"."ITE_ID_CODIGO" = B.ITE_ID_CODIGO  
    //   INNER JOIN 
    //       "TRANSPORTE".S001_Requisicao "C" ON "A"."REQ_ID_CODIGO" = C.REQ_ID_CODIGO  
    //   INNER JOIN 
    //       "TRANSPORTE".S001_Transmeio "D" ON C.TRA_ID_CODIGO = D.TRA_ID_CODIGO 
    //   WHERE 
    //       B.TDE_ID_CODIGO = 7
    // `;
    // const consulta = await this.mDiariaRepository.query(sql);
       

     

      // if (params.CHAPA) {
      //   query.andWhere('B.CHAPA = :CHAPA', { CHAPA: params.CHAPA });
      // }
      // if (params.REQ_ID_CODIGO) {
      //   query.andWhere('A.REQ_ID_CODIGO = :REQ_ID_CODIGO', { REQ_ID_CODIGO: params.REQ_ID_CODIGO });
      // }

      const consulta = await query.getRawMany();
      return consulta.map((item) => new motivoDiariaDto(item));
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao buscar diárias',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(chapa: string, reqidcodigo: number): Promise<motivoDiariaDto> {
    try {
      const query = this.mDiariaRepository
        .createQueryBuilder('A')
        .select([
          'A.MDI_ID_CODIGO as MDI_ID_CODIGO',
          'A.ITE_ID_CODIGO as ITE_ID_CODIGO',
          'A.RRE_ID_CODIGO as RRE_ID_CODIGO',
          'A.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'A.MDI_TIPO as MDI_TIPO',
          'A.MDI_VALOR as MDI_VALOR',
          'A.MDI_CHEFE as MDI_CHEFE',
          'A.MDI_GERENTE as MDI_GERENTE',
          'A.MDI_DIRETOR as MDI_DIRETOR',
          'A.MDI_DIREXECUTIVO as MDI_DIREXECUTIVO',
          'A.MDI_DTAUTORIZA as MDI_DTAUTORIZA',
          'A.MDI_JUSTIFICATIVA as MDI_JUSTIFICATIVA',
          'B.CHAPA',
          'B.TDE_ID_CODIGO',
          'C.REQ_ID_CODIGO',
          'C.REQ_DTSAIDA',
          'C.REQ_HSAIDA',
          'C.REQ_DTRET',
          'C.REQ_HRET',
          'C.REQ_KM',
          'C.REQ_INTEGRAL',
          'C.REQ_PARCIAL',
          'C.REQ_ESPECIAL',
          'C.REQ_PACOTE',
          'D.TRA_DESCRICAO',
          'C.REQ_MOTIVO',
          'C.REQ_GOVERNADOR',
          'C.REQ_STATUS',
        ])
        .distinct(true)
        .innerJoin('s009_itensreqrec', 'B', 'A.ITE_ID_CODIGO = B.ITE_ID_CODIGO')
        .innerJoin('s001_requisicao', 'C', 'A.REQ_ID_CODIGO = C.REQ_ID_CODIGO')
        .innerJoin('s001_transmeio', 'D', 'C.TRA_ID_CODIGO = D.TRA_ID_CODIGO')
        .where('B.TDE_ID_CODIGO = :tdeIdCodigo', { tdeIdCodigo: 7 })
        .andWhere('B.CHAPA = :CHAPA', { CHAPA: chapa })
        .andWhere('C.REQ_ID_CODIGO = :REQ_ID_CODIGO', { REQ_ID_CODIGO: reqidcodigo });

      const consulta = await query.getRawMany();

      return new motivoDiariaDto(consulta[0]);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao buscar diárias',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
