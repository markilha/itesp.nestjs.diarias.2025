import { Entity,  PrimaryColumn } from 'typeorm';

@Entity({ name: 'S001_USUREQ', schema: 'TRANSPORTE' })
export class S001Usureq {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'number' })
  reqIdCodigo: number;

  @PrimaryColumn({ name: 'CODCOLIGADA', type: 'number', precision: 5, scale: 0 })
  codColigada: number;

  @PrimaryColumn({ name: 'CHAPA', type: 'varchar2', length: 16 })
  chapa: string;

  @PrimaryColumn({ name: 'USU_MOV', type: 'char', length: 1 })
  usuMov: string;
}
