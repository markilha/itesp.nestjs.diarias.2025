import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { reqtransEntity } from './requisicaoTrans.entity';

@Entity({ schema: 'TRANSPORTE', name: 'S001_TRANSMEIO' })
export class TransMeioEntity {
  @PrimaryColumn({ name: 'TRA_ID_CODIGO', type: 'number' })
  traIdCodigo: number;

  @Column({ name: 'TRA_DESCRICAO', type: 'varchar2', length: 20, nullable: true })
  traDescricao: string;

  @Column({ name: 'TRA_TIPO', type: 'char', length: 1, nullable: true })
  traTipo: string;
}
