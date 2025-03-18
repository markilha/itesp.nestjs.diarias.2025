import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { FuncSalarioEntity } from './funcsalario.entity';

@Entity('V009_DESPESADIARIA')
export class DespesaDiariaEntity {
  @PrimaryColumn({ name: 'DTD_ID_CODIGO' })
  dtdIdCodigo: number;

  @PrimaryColumn({ name: 'DES_ID_CODIGO' })
  desIdCodigo: number;

  @Column({ name: 'DTD_DESCRICAO', type: 'varchar', length: 100, nullable: true })
  dtdDescricao: string;

  @PrimaryColumn({ name: 'TDE_ID_CODIGO' })
  tdeIdCodigo: number;

  @Column({ name: 'DTD_VALOR_MAX', type: 'decimal', precision: 10, scale: 2, nullable: true })
  dtdValorMax: number;

  @Column({ name: 'CARGO', type: 'varchar', length: 16, nullable: true })
  cargo: string;

  @Column({ name: 'NOME', type: 'varchar', length: 40, nullable: true })
  nome: string;

  @Column({ name: 'DES_DESCRICAO', type: 'varchar', length: 60, nullable: true })
  desDescricao: string;

  @OneToOne(() => FuncSalarioEntity, (desp) => desp.despesaDiaria)
  funcsalario: FuncSalarioEntity;
}
