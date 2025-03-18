import { Entity, Column, ViewEntity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { RequisicaoEntity } from './requisicao.entity';
import { DespesaDiariaEntity } from './despesaDiaria.entity';

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

  @OneToOne(() => RequisicaoEntity, (req) => req.funcSalario)
  requisicao: RequisicaoEntity;

  @OneToOne(() => DespesaDiariaEntity, (func) => func.funcsalario)
  @JoinColumn({ name: 'CARGO', referencedColumnName: 'cargo' })
  despesaDiaria: DespesaDiariaEntity;
}
