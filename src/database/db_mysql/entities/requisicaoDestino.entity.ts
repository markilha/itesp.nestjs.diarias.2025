import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';
import { MunicipiosDetranEntity } from './municipiosDetran.entity';

@Entity('s001_destino', { schema: 'dev_itesp_diarias' }) // Substitua 'TRANSPORTE' pelo nome correto do schema se necessário
export class RequisicaoDestinoEntity {
  @PrimaryColumn({ name: 'DES_ID_CODIGO', type: 'int' })
  desIdCodigo: number;

  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'int' })
  reqIdCodigo: number;

  @Column({ name: 'MUN_ID_CODIGO', type: 'int', nullable: true })
  munIdCodigo: number;

  @Column({ name: 'DES_LOCAL', type: 'varchar', length: 100, nullable: true })
  desLocal: string;

  @Column({ name: 'DES_OBSERVA', type: 'varchar', length: 1000, nullable: true })
  desObserva: string;

  @OneToOne(() => RequisicaoEntity, (requi) => requi.destino)
  requisicao: RequisicaoEntity;

  @OneToOne(() => MunicipiosDetranEntity, (muni) => muni.destino)
  @JoinColumn({ name: 'MUN_ID_CODIGO', referencedColumnName: 'munIdCodigo' })
  municipio: MunicipiosDetranEntity;
}
