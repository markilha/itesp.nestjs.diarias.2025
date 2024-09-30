import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

const schema = process.env.DB_SCHEMA || 'default_schema';

@Entity({ name: 's009_saque', schema })  // Passa o schema dinamicamente
export class SaqueEntity {
  @PrimaryGeneratedColumn({ name: 'SQE_ID_CODIGO' })
  sqeIdCodigo: number;

  @Column({ name: 'SQE_DTSAQUE', type: 'varchar', length: 30, nullable: true })
  sqeDtSaque: string;

  @Column({ name: 'SQE_VLPREST', type: 'decimal', precision: 10, scale: 2, nullable: true })
  sqeVlPrest: number;

  @Column({ name: 'SQE_DTPREST', type: 'varchar', length: 30, nullable: true })
  sqeDtPrest: string;

  @Column({ name: 'SQE_VLSAQUE', type: 'decimal', precision: 10, scale: 2, nullable: true })
  sqeVlSaque: number;

  @Column({ name: 'SQE_EFETIVO', type: 'char', length: 1, nullable: true })
  sqeEfetivo: string;

  @Column({ name: 'SQE_DTPEDIDO', type: 'varchar', length: 30, nullable: true })
  sqeDtPedido: string;
}
