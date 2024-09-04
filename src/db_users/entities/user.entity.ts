import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'UCS_USERS' })
export class Users {
  @PrimaryGeneratedColumn('increment')
  USER_ID: number;

  @Column({ name: 'REAL_NAME', type: 'varchar', length: 255 })
  REAL_NAME: string;

  @Column({ name: 'USERCS_NAME', type: 'varchar', length: 255 })
  USERCS_NAME: string;
  
  @Column({ name: 'USER_PWD', type: 'varchar', length: 255 })
  USER_PWD: string;
}
