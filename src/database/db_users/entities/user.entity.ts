import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'USU_USUARIO_CPF' })
export class Users {
  @PrimaryGeneratedColumn('increment')
  id_usuario: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'login', type: 'varchar', length: 255 })
  login: string;
  
  @Column({ name: 'senha', type: 'varchar', length: 255 })
  senha: string;
}
