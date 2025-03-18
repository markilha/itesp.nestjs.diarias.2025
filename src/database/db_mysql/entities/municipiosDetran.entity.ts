import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { RequisicaoDestinoEntity } from './requisicaoDestino.entity';

@Entity('s001_munic_detran', { schema: 'dev_itesp_diarias' }) // Substitua 'TRANSPORTE' pelo nome correto do schema se necessário
export class MunicipiosDetranEntity {
  @PrimaryColumn({ name: 'MUN_ID_CODIGO', type: 'int' })
  munIdCodigo: number;

  @Column({ name: 'MUN_UF', type: 'varchar', length: 2, nullable: true })
  munUf: string;

  @Column({ name: 'MUN_CIDADE', type: 'varchar', length: 40, nullable: true })
  munCidade: string;

  @Column({ name: 'MUN_TIPO', type: 'int', nullable: true })
  munTipo: number;

  @Column({ name: 'MUN_POPULACAO', type: 'int', nullable: true })
  munPopulacao: number;

  @OneToOne(() => RequisicaoDestinoEntity, (muni) => muni.municipio)
  destino: RequisicaoDestinoEntity;
}
