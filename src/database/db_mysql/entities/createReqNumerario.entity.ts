import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('s009_reqnumerario', { schema: 'dev_itesp_diarias' })
export class CreateReqNumerarioEntity {
  @PrimaryColumn({ type: 'int', name: 'RNU_ID_CODIGO' })
  rnuIdCodigo: number;

  @Column({ type: 'varchar', name: 'CHAPA', nullable: true })
  chapa: string;

  @Column({ type: 'int', name: 'REQ_ID_CODIGO', nullable: true })
  reqIdCodigo: number;

  @Column({ type: 'date', name: 'RNU_DTINICIO', nullable: true })
  rnuDtInicio: Date;

  @Column({type: 'varchar', length: 10, name: 'RNU_HORAINICIO', nullable: true, }) //prettier-ignore
  rnuHoraInicio: string;

  @Column({ type: 'date', name: 'RNU_DTFIM', nullable: true })
  rnuDtFim: Date;

  @Column({ type: 'varchar', length: 10, name: 'RNU_HORAFIM', nullable: true })
  rnuHoraFim: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_INTPREV', nullable: true })
  rnuIntPrev: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_PARPREV', nullable: true })
  rnuParPrev: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_INTREAL', nullable: true })
  rnuIntReal: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_PARREAL', nullable: true })
  rnuParReal: string;

  @Column({ type: 'varchar', length: 1000, name: 'RNU_MOTIVO', nullable: true })
  rnuMotivo: string;

  @Column({ type: 'varchar', length: 1, name: 'RNU_PACOTE', nullable: true })
  rnuPacote: string;

  @Column({ type: 'varchar', length: 1, name: 'RNU_GOVERNADOR', nullable: true, }) //prettier-ignore
  rnuGovernador: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'RNU_VLINTEGRAL',  nullable: true, }) //prettier-ignore})
  rnuVlIntegral: number;

  @Column({ type: 'decimal',  precision: 10, scale: 2, name: 'RNU_VLPARCIAL20', nullable: true, }) //prettier-ignore})
  rnuVlParcial20: number;

  @Column({ type: 'decimal',  precision: 10, scale: 2, name: 'RNU_VLPARCIAL40', nullable: true, }) //prettier-ignore})
  rnuVlParcial40: number;

  @Column({ type: 'date', name: 'RNU_DTSAQUE', nullable: true })
  rnuDtSaque: Date;

  @Column({ type: 'date', name: 'RNU_DTPREST', nullable: true })
  rnuDtPrest: Date;
   
  @Column({ type: 'varchar',length: 1000,  name: 'RNU_STATUS', nullable: true })
  rnuStatus: string;

  @Column({ type: 'int', name: 'RNU_MUN_ORI', nullable: true })
  rnuMunOri: number;

  @Column({ type: 'int', name: 'RNU_MUN_DES', nullable: true })
  rnuMunDes: number;

}
