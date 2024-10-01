import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
 
} from 'typeorm';
import { CreateReqNumerarioEntity } from './createReqNumerario.entity';
import { StatusEntity } from './status.entity';

@Entity('S009_SAQUE', { schema: 'dev_itesp_diarias' })

export class SaqueEntity {
  @PrimaryGeneratedColumn({ name: 'SQE_ID_CODIGO', type: 'int' })
  sqeIdCodigo: number;

  @Column({ name: 'ITE_ID_CODIGO', type: 'int' })
  iteIdCodigo?: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'int' })
  rreIdCodigo?: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'int' })
  dirIdCodigo?: number;

  @Column({ name: 'FPA_ID_CODIGO', type: 'int', nullable: true })
  fpaIdCodigo?: number;

  @Column({ name: 'SQE_DTSAQUE', type: 'varchar', length: 30, nullable: true })
  sqeDtSaque?: string;

  @Column({ name: 'STS_ID_CODIGO', type: 'int', nullable: true })
  stsIdCodigo?: number;

  @Column({
    name: 'SQE_VLPREST',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sqeVlPrest?: number;

  @Column({ name: 'SQE_DTPREST', type: 'varchar', length: 30, nullable: true })
  sqeDtPrest?: string;

  @Column({
    name: 'SQE_VLSAQUE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sqeVlSaque?: number;

  @Column({ name: 'SQE_TIPOSAQUE', type: 'char', length: 1, nullable: true })
  sqeTipoSaque?: string;

  @Column({ name: 'SQE_EFETIVO', type: 'char', length: 1, nullable: true })
  sqeEfetivo?: string;

  @Column({ name: 'SQE_DTPEDIDO', type: 'varchar', length: 30, nullable: true })
  sqeDtPedido?: string;

  @Column({ name: 'SQE_LOTE', type: 'int', nullable: true })
  sqeLote?: number;

  @Column({ name: 'SQE_ANOLOTE', type: 'int', nullable: true })
  sqeAnoLote?: number; 

  @Column({ name: 'SQE_TERCEIRO', type: 'char', length: 1, nullable: true })
  sqeTerceiro?: string;

  @Column({ name: 'PES_ID_CODIGO', type: 'int', nullable: true })
  pesIdCodigo?: number;

  @Column({ name: 'PES_PESSOA', type: 'char', length: 1, nullable: true })
  pesPessoa?: string;

  @Column({ name: 'SQE_USUARIO', type: 'varchar', length: 300, nullable: true })
  sqeUsuario?: string;

  @Column({ name: 'SQE_EMPENHO', type: 'varchar', length: 30, nullable: true })
  sqeEmpenho?: string;

  @Column({
    name: 'SQE_LISTASIAFEM',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  sqeListaSiafem?: string;

  @OneToOne(() => CreateReqNumerarioEntity, (num) => num.saque)
  @JoinColumn({ name: 'SQE_ID_CODIGO', referencedColumnName: 'sqeIdCodigo' })
  numerario?: CreateReqNumerarioEntity;

  @OneToOne(() => StatusEntity, (sts) => sts.saque)
  @JoinColumn({ name: 'STS_ID_CODIGO', referencedColumnName: 'stsIdCodigo' })
  status?: StatusEntity;
}

