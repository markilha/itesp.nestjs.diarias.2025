import { Entity,  JoinColumn,  ManyToOne,  OneToOne,  PrimaryColumn } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';
import { PPessoaEntity } from './ppessoa.entity';


@Entity({ name: 'S001_USUREQ', schema: 'TRANSPORTE' })
export class UsuReqEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'number' })
  reqIdCodigo: number;

  @PrimaryColumn({ name: 'CODCOLIGADA', type: 'number', precision: 5, scale: 0 })
  codColigada: number;

  @PrimaryColumn({ name: 'CHAPA', type: 'varchar2', length: 16 })
  chapa: string;

  @PrimaryColumn({ name: 'USU_MOV', type: 'char', length: 1 })
  usuMov: string;

  @ManyToOne(() => RequisicaoEntity, (requi) => requi.usereq)
  @JoinColumn({ name: 'REQ_ID_CODIGO', referencedColumnName: 'reqIdCodigo' })
  requisicao?: RequisicaoEntity;

  @OneToOne(() => PPessoaEntity, (pessoa) => pessoa.usereq)
  @JoinColumn({ name: 'CHAPA', referencedColumnName: 'codusuario' })
  pessoa?: PPessoaEntity;

  // @OneToOne(() => PFuncEntity, (pfunc) => pfunc.usereq)
  // @JoinColumn({ name: 'CHAPA', referencedColumnName: 'CHAPA' })
  // pfunc?: PFuncEntity;
}
