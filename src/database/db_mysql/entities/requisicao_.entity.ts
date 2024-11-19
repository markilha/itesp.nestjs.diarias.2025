import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { UsuReqEntity } from './usureq.entity';
import { TransMeioEntity } from './transmeio.entity';

@Entity('s001_requisicao') // Nome da tabela
@Index('idx_req_id_codigo', ['reqIdCodigo']) // Definindo o índice
export class Requisicao_Entity {
  @PrimaryGeneratedColumn({ name: 'REQ_ID_CODIGO', type: 'int' })
  reqIdCodigo: number;

  @Column({ name: 'REG_ID_CODIGO', type: 'int', nullable: true })
  regIdCodigo: number;

  @Column({ name: 'COD_MUNICIP', type: 'int', nullable: true })
  codMunicip: number;

  @Column({ name: 'TRA_ID_CODIGO', type: 'int', nullable: true })
  traIdCodigo: number;

  @Column({ name: 'REQ_DTREQ', type: 'varchar', length: 50, nullable: true })
  reqDtReq: string;

  @Column({ name: 'REQ_DTSAIDA', type: 'varchar', length: 50, nullable: true })
  reqDtSaida: string;

  @Column({ name: 'REQ_MOTORISTA', type: 'varchar', length: 50, nullable: true })
  reqMotorista: string;

  @Column({ name: 'REQ_HSAIDA', type: 'varchar', length: 50, nullable: true })
  reqHSaida: string;

  @Column({ name: 'REQ_DTRET', type: 'varchar', length: 50, nullable: true })
  reqDtRet: string;

  @Column({ name: 'REQ_MOTIVO', type: 'text', nullable: true })
  reqMotivo: string;

  @Column({ name: 'REQ_HRET', type: 'varchar', length: 50, nullable: true })
  reqHRet: string;

  @Column({ name: 'REQ_KM', type: 'int', nullable: true })
  reqKm: number;

  @Column({ name: 'REQ_STATUS', type: 'varchar', length: 50, nullable: true })
  reqStatus: string;

  @Column({ name: 'REQ_DIARIA', type: 'varchar', length: 50, nullable: true })
  reqDiaria: string;

  @Column({ name: 'REQ_INTEGRAL', type: 'varchar', length: 50, nullable: true })
  reqIntegral: string;

  @Column({ name: 'REQ_PARCIAL', type: 'varchar', length: 50, nullable: true })
  reqParcial: string;

  @Column({ name: 'REQ_ESPECIAL', type: 'varchar', length: 50, nullable: true })
  reqEspecial: string;

  @Column({ name: 'REQ_PACOTE', type: 'int', nullable: true })
  reqPacote: number;

  @Column({ name: 'REQ_GOVERNADOR', type: 'varchar', length: 50, nullable: true })
  reqGovernador: string;

  @OneToOne(() => UsuReqEntity, (req) => req.requisicao)  
  usureq?: UsuReqEntity; 

  @OneToOne(() => TransMeioEntity, (req) => req.requisicao)
  @JoinColumn({ name: 'TRA_ID_CODIGO', referencedColumnName: 'traIdCodigo' })
  transmeio?: TransMeioEntity; 

 
}
