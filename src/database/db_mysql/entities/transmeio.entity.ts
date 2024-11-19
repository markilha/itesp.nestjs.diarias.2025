import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Requisicao_Entity } from './requisicao_.entity';


@Entity('s001_transmeio', { schema: 'dev_itesp_diarias' })
export class TransMeioEntity {

  @PrimaryColumn({ name: 'TRA_ID_CODIGO', type: 'int' })
  traIdCodigo: number;

  @Column({ name: 'TRA_DESCRICAO', type: 'varchar', length: 20, nullable: true })
  traDescricao: string;

  @Column({ name: 'TRA_TIPO', type: 'char', length: 1, nullable: true })
  traTipo: string;

  @OneToOne(() => Requisicao_Entity, (req) => req.transmeio)
  requisicao?: Requisicao_Entity; 

}
