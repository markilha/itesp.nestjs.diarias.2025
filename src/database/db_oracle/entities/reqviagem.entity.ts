import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('S009_REQVIAGEM', { schema: 'FINANCEIRO' })
export class ReqViagemEntity {
  @PrimaryColumn({ type: 'char', length: 18, name: 'RQV_ID_CODIGO' })
  rqvIdCodigo: string;

  @PrimaryColumn({ type: 'number', name: 'RNU_ID_CODIGO' })
  rnuIdCodigo: number;

  @Column({ type: 'number', name: 'REQ_ID_CODIGO', nullable: true })
  reqIdCodigo: number;

  @Column({ type: 'date', name: 'RQV_DTINICIO', nullable: true })
  rqvDtInicio: Date;

  @Column({ type: 'char', length: 1, name: 'RQV_ORDEM', nullable: true })
  rqvOrdem: string;

  @Column({ type: 'varchar2', length: 10, name: 'RQV_HINICIO', nullable: true })
  rqvHInicio: string;
}
