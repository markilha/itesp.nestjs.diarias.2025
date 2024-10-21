import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { RequisicaoDestinoEntity } from './requisicaoDestino.entity';

@Entity('S001_MUNIC_DETRAN', { schema: 'TRANSPORTE' }) // Substitua 'TRANSPORTE' pelo nome correto do schema se necessário
export class MunicipiosDetranEntity {

  @PrimaryColumn({ name: 'MUN_ID_CODIGO', type: 'number' })
  munIdCodigo: number;

  @Column({ name: 'MUN_UF', type: 'char', length: 2, nullable: true })
  munUf: string;

  @Column({ name: 'MUN_CIDADE', type: 'varchar2', length: 40, nullable: true })
  munCidade: string;

  @Column({ name: 'MUN_TIPO', type: 'number', nullable: true })
  munTipo: number;

  @Column({ name: 'MUN_POPULACAO', type: 'number', nullable: true })
  munPopulacao: number;

  @OneToOne(() => RequisicaoDestinoEntity, (muni) => muni.municipio)
  destino: RequisicaoDestinoEntity;
}
