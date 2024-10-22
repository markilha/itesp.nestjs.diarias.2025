import { Entity, Column, ViewEntity, PrimaryColumn } from 'typeorm';

@Entity('V009_FUNCSALARIO', { schema: 'FINANCEIRO' })
export class FuncSalarioEntity {
  @PrimaryColumn({ name: 'CHAPA' })
  chapa: string;

  @Column({ name: 'CODSECAO' })
  codsecao: string;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'FUNCAO' })
  funcao: string;

  @Column({ name: 'CODFUNCAO' })
  codfuncao: string;

  @Column({ name: 'CARGO' })
  cargo: string;

  @Column({ name: 'SALARIO' })
  salario: number;

  @Column({ name: 'SETOR' })
  setor: string;

  @Column({ name: 'REG_ID_CODIGO' })
  regIdCodigo: string;

  @Column({ name: 'REG_DESCRICAO' })
  regDescricao: string;
}


