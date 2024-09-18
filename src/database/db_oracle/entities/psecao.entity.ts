import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('PSECAO', { schema: 'RM' })
export class Psecao {
  @PrimaryColumn({ type: 'varchar2' })
  CODIGO: string;

  @Column({ type: 'varchar2' })
  DESCRICAO: string;
  
  @Column({ type: 'varchar2' })
  CIDADE: string;

  @Column({ type: 'varchar2' })
  CGC: string;

}
