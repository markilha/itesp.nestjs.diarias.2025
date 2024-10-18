import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';

@Entity('municipios_ibge_igc', { schema: 'dev_itesp_diarias' })
export class MunicipiosIbgIEntity {
  @PrimaryColumn({ name: 'COD_MUNICIP', type: 'int' })
  codMunicipio: number;

  @Column({ name: 'NME_MUNIC', type: 'varchar', length: 50, nullable: true })
  nmeMunic: string;
}
