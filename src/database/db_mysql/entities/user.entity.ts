import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'usu_usuario_cpf', schema: 'dev_itesp_diarias' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id_usuario: number;
  @Column({ name: 'nome', type: 'varchar' })
  nome: string;
  @Column({ name: 'login', type: 'varchar' })
  login: string;

  @Column({ name: 'chapa', type: 'varchar' })
  chapa: string;

  @Column({ name: 'senha', type: 'varchar' })
  senha: string;
}
