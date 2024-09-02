import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1725288784305 implements MigrationInterface {
    name = 'Default1725288784305'

    public async up(queryRunner: QueryRunner): Promise<void> {      
        await queryRunner.query(`ALTER TABLE "users" ADD "email" varchar2(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);       
    }

}
