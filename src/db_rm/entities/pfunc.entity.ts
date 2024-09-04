import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PFUNC', { schema: 'RM' })
export class pFunc {
  @PrimaryColumn({ type: 'varchar2', length: 120, name: 'CHAPA' })
  CHAPA: string;
 

  @Column({ type: 'varchar2', length: 120, name: 'CODSECAO', nullable: true })
  CODSECAO: string;

  @Column({ type: 'varchar2', length: 120, name: 'CODFUNCAO', nullable: true })
  CODFUNCAO: string;
}
