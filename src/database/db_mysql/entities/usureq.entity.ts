import { Entity,  JoinColumn,  ManyToOne,  OneToOne,  PrimaryColumn } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';
import { FuncSalarioEntity } from './funcsalario.entity';

@Entity({ name: 's001_usureq', schema: 'dev_itesp_diarias' })
export class UsuReqEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'int' })
  reqIdCodigo: number;

  @PrimaryColumn({ name: 'CODCOLIGADA', type: 'int', precision: 5, scale: 0 })
  codColigada: number;

  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 16 })
  chapa: string;

  @PrimaryColumn({ name: 'USU_MOV', type: 'varchar', length: 1 })
  usuMov: string;

  @ManyToOne(() => RequisicaoEntity, (requi) => requi.usereq)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  requisicao?: RequisicaoEntity;

  @OneToOne(() => FuncSalarioEntity, (pfun) => pfun.usureq)
  @JoinColumn({ name: 'CHAPA', referencedColumnName: 'chapa' })
  pfunc?: FuncSalarioEntity; 


}
