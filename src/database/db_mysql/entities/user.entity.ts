import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'usu_usuario_cpf',schema: 'dev_itesp_diarias' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id_usuario: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'login', type: 'varchar', length: 255 })
  login: string;
  
  @Column({ name: 'senha', type: 'varchar', length: 255 })
  senha: string;
}
