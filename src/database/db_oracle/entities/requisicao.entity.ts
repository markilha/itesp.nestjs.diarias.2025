import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UsuReqEntity } from './usureq.entity';
import { TransMeioEntity } from './transmeio.entity';
import { MunicipioEntity } from './municipios.entity';
import { RequisicaoDestinoEntity } from './requisicaoDestino.entity';
import { MunicipiosIbgIEntity } from './municipiosIBGE';

@Entity('S001_REQUISICAO', { schema: 'TRANSPORTE' })
export class RequisicaoEntity {

  @PrimaryGeneratedColumn({ name: 'REQ_ID_CODIGO' })
  reqIdCodigo: number;

  @Column({ name: 'REG_ID_CODIGO', nullable: true, type: 'number' })
  regIdCodigo: number;

  @Column({ name: 'COD_MUNICIP', nullable: true, type: 'number' })
  codMunicipio: number;

  @Column({ name: 'TRA_ID_CODIGO', nullable: true, type: 'number' })
  traIdCodigo: number;

  @Column({ name: 'REQ_DTREQ', nullable: true, type: 'varchar2', length: 25 })
  reqDtReq: string;

  @Column({ name: 'REQ_DTSAIDA', nullable: true, type: 'date' })
  reqDtSaida: Date;

  @Column({ name: 'REQ_MOTORISTA', nullable: true, type: 'char', length: 1 })
  reqMotorista: string;

  @Column({ name: 'REQ_HSAIDA', nullable: true, type: 'varchar2', length: 10 })
  reqHSaida: string;

  @Column({ name: 'REQ_DTRET', nullable: true, type: 'date' })
  reqDtRetorno: Date;

  @Column({
    name: 'REQ_MOTIVO',
    nullable: true,
    type: 'varchar2',
    length: 1000,
  })
  reqMotivo: string;

  @Column({ name: 'REQ_HRET', nullable: true, type: 'varchar2', length: 10 })
  reqHRet: string;

  @Column({
    name: 'REQ_KM',
    nullable: true,
    type: 'number',
    precision: 10,
    scale: 2,
  })
  reqKm: number;

  @Column({ name: 'REQ_STATUS', nullable: true, type: 'varchar2', length: 40 })
  reqStatus: string;

  @Column({ name: 'REQ_DIARIA', nullable: true, type: 'char', length: 1 })
  reqDiaria: string;

  @Column({ name: 'REQ_INTEGRAL', nullable: true, type: 'number' })
  reqIntegral: number;

  @Column({ name: 'REQ_PARCIAL', nullable: true, type: 'number' })
  reqParcial: number;

  @Column({ name: 'REQ_ESPECIAL', nullable: true, type: 'number' })
  reqEspecial: number;

  @Column({ name: 'REQ_PACOTE', nullable: true, type: 'char', length: 1 })
  reqPacote: string;

  @Column({ name: 'REQ_GOVERNADOR', nullable: true, type: 'char', length: 1 })
  reqGovernador: string;

  @OneToMany(() => UsuReqEntity, (usu) => usu.requisicao)
  usereq?: UsuReqEntity[];

  @OneToOne(() => TransMeioEntity, (trans) => trans.requisicao)
  @JoinColumn({ name: 'TRA_ID_CODIGO', referencedColumnName: 'traIdCodigo' })
  transmeio: TransMeioEntity;

  @OneToOne(() => MunicipioEntity, (muni) => muni.requisicao)
  @JoinColumn({ name: 'COD_MUNICIP', referencedColumnName: 'codMunicipio' })
  municipio: MunicipioEntity;

  @OneToOne(() => RequisicaoDestinoEntity, (muni) => muni.requisicao)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  destino: RequisicaoDestinoEntity;

  @OneToOne(() => MunicipiosIbgIEntity, (muni) => muni.requisicao)
  @JoinColumn({ name: 'COD_MUNICIP', referencedColumnName: 'codMunicipio' })
  municipio_partida: MunicipiosIbgIEntity;


}
