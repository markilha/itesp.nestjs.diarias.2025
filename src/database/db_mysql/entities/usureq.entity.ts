import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Requisicao_Entity } from './requisicao_.entity';
import { FuncSalarioEntity } from './funcsalario.entity';
import { RequisicaoDestinoEntity } from './requisicaoDestino.entity';

@Entity({ name: 's001_usureq', schema: 'dev_itesp_diarias' })
export class UsuReqEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'int' })
  REQ_ID_CODIGO: number;

  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 16 })
  CHAPA: string;

  @PrimaryColumn({ name: 'USU_MOV', type: 'varchar', length: 1 })
  USU_MOV: string;

  @OneToOne(() => Requisicao_Entity, (req) => req.usureq)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  requisicao?: Requisicao_Entity;

  @OneToOne(() => FuncSalarioEntity, (req) => req.requisicao)
  @JoinColumn({ name: 'CHAPA', referencedColumnName: 'chapa' })
  funcsalario?: FuncSalarioEntity;

  @OneToOne(() => RequisicaoDestinoEntity, (req) => req.requisicao)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  destino?: RequisicaoDestinoEntity;
}
