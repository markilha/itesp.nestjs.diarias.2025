import { Entity,  JoinColumn,  ManyToOne,  PrimaryColumn } from 'typeorm';
import { Requisicao } from './requisicao.entity';

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

  @ManyToOne(() => Requisicao, (requi) => requi.usereq)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  requisicao?: Requisicao;



}
