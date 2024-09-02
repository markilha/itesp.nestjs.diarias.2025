import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'login', type: 'varchar', length: 255 })
  login: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true  })
  email: string;
  
  @Column({ name: 'senha', type: 'varchar', length: 255 })
  senha: string;
}
