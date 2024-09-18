import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'S001_USUREQ', schema: 'dev_itesp_diarias' })
export class CreateUsuReqEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'int' }) // Alterado para 'int'
  reqIdCodigo: number;

  @PrimaryColumn({ name: 'CODCOLIGADA', type: 'int' }) // Alterado para 'int'
  codColigada: number;

  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 16 }) // Alterado para 'varchar'
  chapa: string;

  @PrimaryColumn({ name: 'USU_MOV', type: 'char', length: 1 })
  usuMov: string;
}
