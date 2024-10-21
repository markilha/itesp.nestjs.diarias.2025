import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotivodiariaEntity } from 'src/database/db_mysql/entities/motivoDiaria.entity';

import { Repository } from 'typeorm';
import { FindAllParams, motivoDiariaDto } from './motivodiariaDto';

@Injectable()
export class MotivodiariaService {
  constructor(
    @InjectRepository(MotivodiariaEntity, 'mysqlConnection')
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
          'C.REQ_STATUS',
          'D.TRA_DESCRICAO',
          'C.REQ_MOTIVO',
          'C.REQ_GOVERNADOR',
          'C.REQ_PACOTE',
        ])
        .innerJoin('s009_itensreqrec', 'B', 'A.ITE_ID_CODIGO = B.ITE_ID_CODIGO')
        .innerJoin('s001_requisicao', 'C', 'A.REQ_ID_CODIGO = C.REQ_ID_CODIGO')
        .innerJoin('s001_transmeio', 'D', 'C.TRA_ID_CODIGO = D.TRA_ID_CODIGO')
        .where('B.TDE_ID_CODIGO = :tdeIdCodigo', { tdeIdCodigo: 7 });
  
      if (params.CHAPA) {
        query.andWhere('B.CHAPA = :CHAPA', { CHAPA: params.CHAPA });
      }
      if (params.REQ_ID_CODIGO) {
        query.andWhere('A.REQ_ID_CODIGO = :REQ_ID_CODIGO', { REQ_ID_CODIGO: params.REQ_ID_CODIGO });
      }
  
      const consulta = await query.getRawMany();

      return consulta.map((item) => new motivoDiariaDto (item));
    
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

  async findOne(chapa:string,reqidcodigo:number): Promise<motivoDiariaDto> {
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
        .andWhere('C.REQ_ID_CODIGO = :REQ_ID_CODIGO', {REQ_ID_CODIGO: reqidcodigo });
     
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
