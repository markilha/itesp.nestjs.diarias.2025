import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';

@Entity('MUNICIPIOS_IBGE_IGC',{ schema: 'COMUM' })
export class MunicipiosIbgIEntity {
  @PrimaryColumn({ name: 'COD_MUNICIP', type: 'number' })
  codMunicipio: number;

  @Column({ name: 'NME_MUNIC', type: 'varchar2', length: 50, nullable: true })
  nmeMunic: string;

}
