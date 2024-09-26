import { Entity, Column, ViewEntity, PrimaryColumn } from 'typeorm';

@Entity('ss09_funcsalario', { schema: 'FINANCEIRO' })
export class FuncSalarioEntity {
  @PrimaryColumn({ name: 'chapa' })
  chapa: string;

  @Column({ name: 'codsecao' })
  codsecao: string;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'funcao' })
  funcao: string;

  @Column({ name: 'codfuncao' })
  codfuncao: string;

  @Column({ name: 'cargo' })
  cargo: string;

  @Column({ name: 'salario' })
  salario: number;

  @Column({ name: 'setor' })
  setor: string;

  @Column({ name: 'reg_id_codigo' })
  regIdCodigo: string;

  @Column({ name: 'reg_descricao' })
  regDescricao: string;
}
