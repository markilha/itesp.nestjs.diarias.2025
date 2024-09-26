import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { UsuReqEntity } from './usureq.entity';
@Entity('v009_funcsalario', { schema: 'dev_itesp_diarias' })
export class FuncSalarioEntity {
  @PrimaryColumn({ name: 'chapa', type: 'varchar', length: 50 }) 
  chapa: string;

  @Column({ name: 'codsecao', type: 'varchar', length: 50 }) 
  codsecao: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 }) 
  nome: string;

  @Column({ name: 'funcao', type: 'varchar', length: 255 })
  funcao: string;

  @Column({ name: 'codfuncao', type: 'varchar', length: 50 })
  codfuncao: string;

  @Column({ name: 'cargo', type: 'varchar', length: 50 })
  cargo: string;

  @Column({ name: 'salario', type: 'decimal', precision: 10, scale: 2 }) 
  salario: number;

  @Column({ name: 'setor', type: 'varchar', length: 255 })
  setor: string;

  @Column({ name: 'reg_id_codigo', type: 'varchar', length: 50 })
  regIdCodigo: string;

  @Column({ name: 'reg_descricao', type: 'varchar', length: 255 })
  regDescricao: string;

  @OneToOne(() => UsuReqEntity, (usu) => usu.pfunc)  
  usureq?: UsuReqEntity;  
}

