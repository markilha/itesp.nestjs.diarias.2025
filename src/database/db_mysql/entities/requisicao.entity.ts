import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { RequisicaoDestinoEntity } from './requisicaoDestino.entity';
import { FuncSalarioEntity } from './funcsalario.entity';
import { UsuReqEntity } from './usureq.entity';

@Entity('v009_requisicao', { schema: 'dev_itesp_diarias' })
export class RequisicaoEntity {
  @PrimaryGeneratedColumn({ name: 'REQ_ID_CODIGO' })
  reqIdCodigo: number;

  @Column({ name: 'REG_ID_CODIGO', type: 'int', nullable: true })
  regIdCodigo: number;

  @Column({ name: 'COD_MUNICIP', type: 'int', nullable: true })
  codMunicipio: number;

  @Column({ name: 'REQ_DTREQ', type: 'varchar', length: 50, nullable: true })
  reqDtReq: string;

  @Column({ name: 'REQ_DTSAIDA', type: 'varchar', length: 50, nullable: true })
  reqDtSaida: string;

  @Column({ name: 'REQ_MOTORISTA', type: 'varchar', length: 50, nullable: true })
  reqMotorista: string;

  @Column({ name: 'REQ_HSAIDA', type: 'varchar', length: 50, nullable: true })
  reqHSaida: string;

  @Column({ name: 'REQ_HRET', type: 'varchar', length: 50, nullable: true })
  reqHRet: string;

  @Column({ name: 'REQ_MOTIVO', type: 'text', nullable: true })
  reqMotivo: string;

  @Column({ name: 'REQ_KM', type: 'int', nullable: true })
  reqKm: number;

  @Column({ name: 'REQ_STATUS', type: 'varchar', length: 50, nullable: true })
  reqStatus: string;

  @Column({ name: 'REQ_DIARIA', type: 'int', nullable: true })
  reqDiaria: number;

  @Column({ name: 'REQ_INTEGRAL', type: 'int', nullable: true })
  reqIntegral: number;

  @Column({ name: 'REQ_PARCIAL', type: 'int', nullable: true })
  reqParcial: number;

  @Column({ name: 'REQ_ESPECIAL', type: 'int', nullable: true })
  reqEspecial: number;

  @Column({ name: 'TRA_ID_CODIGO', type: 'int', nullable: true })
  traIdCodigo: number;

  @Column({ name: 'NME_MUNIC', type: 'varchar', length: 50, nullable: true })
  nmeMunic: string;

  @Column({ name: 'REG_DESCRICAO', type: 'varchar', length: 60, nullable: true })
  regDescricao: string;

  @Column({ name: 'TRA_DESCRICAO', type: 'varchar', length: 50, nullable: true })
  traDescricao: string;

  @Column({ name: 'CHAPA', type: 'varchar', length: 16, nullable: true })
  chapa: string;

  @Column({ name: 'REQ_PACOTE', type: 'int', nullable: true })
  reqPacote: number;

  @Column({ name: 'REQ_GOVERNADOR', type: 'varchar', length: 50, nullable: true })
  reqGovernador: string;

  @OneToOne(() => RequisicaoDestinoEntity, (muni) => muni.requisicao)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  destino: RequisicaoDestinoEntity;

  @OneToOne(() => FuncSalarioEntity, (muni) => muni.requisicao)
  @JoinColumn({ name: 'CHAPA', referencedColumnName: 'chapa' })
  funcSalario: FuncSalarioEntity;

  @OneToOne(() => UsuReqEntity, (req) => req.requisicao)  
  usureq?: UsuReqEntity; 


}
