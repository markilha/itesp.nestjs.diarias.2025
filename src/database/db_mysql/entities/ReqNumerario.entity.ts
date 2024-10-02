import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { SaqueEntity } from './saque.entity';

@Entity('s009_reqnumerario', { schema: 'dev_itesp_diarias' })
export class ReqNumerarioEntity {
  @PrimaryGeneratedColumn({ name: 'RNU_ID_CODIGO' })
  rnuIdCodigo: number;
  
  @Column({
    name: 'CHAPA',
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  chapa: string;

  @Column({ name: 'SQE_ID_CODIGO', nullable: true, type: 'int' })
  sqeIdCodigo: number;

  @Column({ name: 'REQ_ID_CODIGO', nullable: true, type: 'int' })
  reqIdCodigo?: number;

  @Column({ name: 'ITE_ID_CODIGO', nullable: true, type: 'int' })
  iteIdCodigo?: number;

  @Column({ name: 'RRE_ID_CODIGO', nullable: true, type: 'int' })
  rreIdCodigo?: number;

  @Column({ name: 'DIR_ID_CODIGO', nullable: true, type: 'int' })
  dirIdCodigo?: number;

  @Column({ name: 'RNU_DTINICIO', nullable: true, type: 'date' })
  rnuDtInicio: Date;

  @Column({
    name: 'RNU_HORAINICIO',
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  rnuHoraInicio: string;

  @Column({ name: 'RNU_DTFIM', nullable: true, type: 'date' })
  rnuDtFim: Date;

  @Column({ name: 'RNU_HORAFIM', nullable: true, type: 'varchar', length: 10 })
  rnuHoraFim: string;

  @Column({ name: 'RNU_INTPREV', nullable: true, type: 'varchar', length: 5 })
  rnuIntPrev: string;

  @Column({ name: 'RNU_PARPREV', nullable: true, type: 'varchar', length: 5 })
  rnuParPrev: string;

  @Column({ name: 'RNU_INTREAL', nullable: true, type: 'varchar', length: 5 })
  rnuIntReal: string;

  @Column({ name: 'RNU_PARREAL', nullable: true, type: 'varchar', length: 5 })
  rnuParReal: string;

  @Column({ name: 'RNU_MOTIVO', nullable: true, type: 'varchar', length: 1000 })
  rnuMotivo: string;

  @Column({ name: 'RNU_PACOTE', nullable: true, type: 'char', length: 1 })
  rnuPacote: string;

  @Column({ name: 'RNU_GOVERNADOR', nullable: true, type: 'char', length: 1 })
  rnuGovernador: string;

  @Column({
    name: 'RNU_VLINTEGRAL',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  rnuVlIntegral: number;

  @Column({
    name: 'RNU_VLPARCIAL',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  rnuVlParcial: number;

  @Column({
    name: 'RNU_VLBASE',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  rnuVlBase: number;

  @OneToOne(() => SaqueEntity, (saq) => saq.numerario)
  saque?: SaqueEntity;
}

// @Entity('s009_reqnumerario', { schema: 'dev_itesp_diarias' })
// export class CreateReqNumerarioEntity {
//   @PrimaryColumn({ type: 'int', name: 'RNU_ID_CODIGO' })
//   rnuIdCodigo: number;

//   @Column({ type: 'varchar', name: 'CHAPA', nullable: true })
//   chapa: string;

//   @Column({ type: 'int', name: 'REQ_ID_CODIGO', nullable: true })
//   reqIdCodigo: number;

//   @Column({ type: 'int', name: 'SQE_ID_CODIGO', nullable: true })
//   sqeIdCodigo: number;

//   @Column({ type: 'date', name: 'RNU_DTINICIO', nullable: true })
//   rnuDtInicio: Date;

//   @Column({type: 'varchar', length: 10, name: 'RNU_HORAINICIO', nullable: true, }) //prettier-ignore
//   rnuHoraInicio: string;

//   @Column({ type: 'date', name: 'RNU_DTFIM', nullable: true })
//   rnuDtFim: Date;

//   @Column({ type: 'varchar', length: 10, name: 'RNU_HORAFIM', nullable: true })
//   rnuHoraFim: string;

//   @Column({ type: 'varchar', length: 5, name: 'RNU_INTPREV', nullable: true })
//   rnuIntPrev: string;

//   @Column({ type: 'varchar', length: 5, name: 'RNU_PARPREV', nullable: true })
//   rnuParPrev: string;

//   @Column({ type: 'varchar', length: 5, name: 'RNU_INTREAL', nullable: true })
//   rnuIntReal: string;

//   @Column({ type: 'varchar', length: 5, name: 'RNU_PARREAL', nullable: true })
//   rnuParReal: string;

//   @Column({ type: 'varchar', length: 1000, name: 'RNU_MOTIVO', nullable: true })
//   rnuMotivo: string;

//   @Column({ type: 'varchar', length: 1, name: 'RNU_PACOTE', nullable: true })
//   rnuPacote: string;

//   @Column({ type: 'varchar', length: 1, name: 'RNU_GOVERNADOR', nullable: true, }) //prettier-ignore
//   rnuGovernador: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, name: 'RNU_VLINTEGRAL',  nullable: true, }) //prettier-ignore})
//   rnuVlIntegral: number;

//   @Column({ type: 'decimal',  precision: 10, scale: 2, name: 'RNU_VLPARCIAL20', nullable: true, }) //prettier-ignore})
//   rnuVlParcial20: number;

//   @Column({ type: 'decimal',  precision: 10, scale: 2, name: 'RNU_VLPARCIAL40', nullable: true, }) //prettier-ignore})
//   rnuVlParcial40: number;

//   @Column({ type: 'decimal',  precision: 10, scale: 2, name: 'RNU_VLBASE', nullable: true, }) //prettier-ignore})
//   rnuVlBase: number;

//   @Column({ type: 'date', name: 'RNU_DTSAQUE', nullable: true })
//   rnuDtSaque: Date;

//   @Column({ type: 'date', name: 'RNU_DTPREST', nullable: true })
//   rnuDtPrest: Date;

//   @Column({ type: 'int', name: 'RNU_MUN_ORI', nullable: true })
//   rnuMunOri: number;

//   @Column({ type: 'int', name: 'RNU_MUN_DES', nullable: true })
//   rnuMunDes: number;

//   @OneToOne(() => SaqueEntity, (saq) => saq.numerario)
//   saque?: SaqueEntity;

// }
