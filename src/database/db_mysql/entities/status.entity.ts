import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { SaqueEntity } from './saque.entity';

@Entity('s009_status', { schema: 'dev_itesp_diarias' })
export class StatusEntity {
  @PrimaryColumn({ type: 'int', name: 'STS_ID_CODIGO' })
  stsIdCodigo: number;

  @Column({ name: 'STS_DESCRICAO', type: 'varchar' })
  stsDescricao: string;

  @OneToOne(() => SaqueEntity, (sts) => sts.status)
  saque?: SaqueEntity;
}
