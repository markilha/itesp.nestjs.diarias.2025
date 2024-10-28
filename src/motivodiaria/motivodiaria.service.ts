import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotivodiariaEntity } from '../database/db_oracle/entities/motivoDiaria.entity';

import { Repository } from 'typeorm';
import { motivoDiariaDto } from './motivodiariaDto';

@Injectable()
export class MotivodiariaService {
  constructor(
    @InjectRepository(MotivodiariaEntity, 'oracleConnection')
    private mDiariaRepository: Repository<MotivodiariaEntity>,
  ) {}

  async findOne(chapa: string, requi: number): Promise<motivoDiariaDto> {
    const reqidcodigo = Number(requi) || 0;

    try {
      const consulta = await this.mDiariaRepository.query(
        `SELECT
          a.MDI_ID_CODIGO as MDI_ID_CODIGO,
          a.ITE_ID_CODIGO as ITE_ID_CODIGO,
          a.RRE_ID_CODIGO as RRE_ID_CODIGO,
          a.DIR_ID_CODIGO as DIR_ID_CODIGO,
          a.MDI_TIPO as MDI_TIPO,
          a.MDI_VALOR as MDI_VALOR,
          a.MDI_CHEFE as MDI_CHEFE,
          a.MDI_GERENTE as MDI_GERENTE,
          a.MDI_DIRETOR as MDI_DIRETOR,
          a.MDI_DIREXECUTIVO as MDI_DIREXECUTIVO,
          a.MDI_DTAUTORIZA as MDI_DTAUTORIZA,
          a.MDI_JUSTIFICATIVA as MDI_JUSTIFICATIVA,
          b.CHAPA as CHAPA,
          b.TDE_ID_CODIGO as TDE_ID_CODIGO,
          c.REQ_ID_CODIGO as REQ_ID_CODIGO,
          c.REQ_DTSAIDA as REQ_DTSAIDA,
          c.REQ_HSAIDA as REQ_HSAIDA,
          c.REQ_DTRET as REQ_DTRET,
          c.REQ_HRET as REQ_HRET,         
          c.REQ_INTEGRAL as REQ_INTEGRAL,
          c.REQ_PARCIAL as REQ_PARCIAL,
          c.REQ_GOVERNADOR as REQ_GOVERNADOR,
          c.REQ_MOTIVO as REQ_MOTIVO,
          c.REQ_PACOTE as REQ_PACOTE,
          c.REQ_STATUS as REQ_STATUS
        FROM FINANCEIRO.S009_MOTIVODIARIA a     
        INNER JOIN FINANCEIRO.V009_ITENSREQREC b ON a.ITE_ID_CODIGO = b.ITE_ID_CODIGO        
        INNER JOIN TRANSPORTE.S001_REQUISICAO  c ON c.REQ_ID_CODIGO = a.REQ_ID_CODIGO
        WHERE b.CHAPA = :chapa AND c.REQ_ID_CODIGO = :reqidcodigo
      `,
        [chapa, reqidcodigo],
      );  

      if (consulta.length === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Diária não encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return new motivoDiariaDto(consulta[0]);
    } catch (error) {      
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Motivo de Diária não encontrado',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
