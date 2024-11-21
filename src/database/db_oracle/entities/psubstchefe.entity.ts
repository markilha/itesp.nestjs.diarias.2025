import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('PSUBSTCHEFE',{schema: 'RM'}) 
export class psubstchefeEntity {
  @PrimaryColumn({ type: "number", precision: 5, scale: 0 })
  CODCOLIGADA: number;

  @Column({ type: "varchar2", length: 35, nullable: false })
  CODSECAO: string;

  @Column({ type: "varchar2", length: 16, nullable: false })
  CHAPASUBST: string;

  @Column({ type: "date", nullable: true })
  DATAINICIO?: Date;

  @Column({ type: "date", nullable: true })
  DATAFIM?: Date;

  @Column({ type: "number", precision: 5, scale: 0, default: 0, nullable: true })
  MASTER?: number;

  @Column({ type: "number", precision: 5, scale: 0, nullable: false })
  CODCOLSUBST: number;

  @Column({ type: "number", precision: 5, scale: 0, nullable: true })
  CHEFIAAPROVBAT?: number;

  @Column({ type: "varchar2", length: 50, nullable: true })
  RECCREATEDBY?: string;

  @Column({ type: "date", nullable: true })
  RECCREATEDON?: Date;

  @Column({ type: "varchar2", length: 50, nullable: true })
  RECMODIFIEDBY?: string;

  @Column({ type: "date", nullable: true })
  RECMODIFIEDON?: Date;

  @Column({ type: "number", precision: 5, scale: 0, default: 1, nullable: false })
  RECEBEEMAIL: number;

  @Column({ type: "number", precision: 5, scale: 0, nullable: true })
  CODCOLIGADASOLICITANTE?: number;

  @Column({ type: "varchar2", length: 16, nullable: true })
  CHAPASOLICITANTE?: string;

  @Column({ type: "varchar2", length: 16, nullable: true })
  CODEXTERNOSOLICITANTE?: string;
}

