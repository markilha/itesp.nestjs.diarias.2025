import { Entity, Column,PrimaryGeneratedColumn } from 'typeorm';

@Entity('documentos', { schema: 'dev_itesp_diarias' })
export class docsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column({ name: 'SQE_ID_CODIGO', type: 'int' })
  SQE_ID_CODIGO: number;

  @Column({ name: 'NOME_DOCUMENTO', type: 'varchar' })
  NOME_DOCUMENTO: string;

  @Column({ name: 'ORIGINAL_NAME', type: 'varchar' })
  ORIGINAL_NAME: string;
}
