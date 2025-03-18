import { MigrationInterface, QueryRunner } from 'typeorm';

export class Default1726685516862 implements MigrationInterface {
  name = 'Default1726685516862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`usu_usuario_cpf_id_estado_civil_fkey\` ON \`usu_usuario_cpf\``,
    );
    await queryRunner.query(`DROP INDEX \`usu_usuario_cpf_id_raca_fkey\` ON \`usu_usuario_cpf\``);
    await queryRunner.query(
      `DROP INDEX \`usu_usuario_cpf_id_regional_fkey\` ON \`usu_usuario_cpf\``,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_sistema\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_status\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`chapa\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`dt_nascimento\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`nome_social\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`nome_mae\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`nome_pai\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`sexo\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_raca\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_identidade_genero\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_orientacao_sexual\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_pais\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_cnae\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_estado_civil\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_regime_casamento\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_escolaridade\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`id_regional\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`uniao_estavel\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`nome\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`nome\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`login\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`login\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`senha\``);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`senha\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_ID_CODIGO\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_ID_CODIGO\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_VALOR\``);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_VALOR\` int(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_DTINICIO\``);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_DTINICIO\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_DTFINAL\``);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_DTFINAL\` date NULL`);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`RNU_ID_CODIGO\` \`RNU_ID_CODIGO\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_ID_CODIGO\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_ID_CODIGO\` int NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`CHAPA\``);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` ADD \`CHAPA\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`REQ_ID_CODIGO\` \`REQ_ID_CODIGO\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLINTEGRAL\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLINTEGRAL\` decimal(10,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLPARCIAL20\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLPARCIAL20\` decimal(10,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLPARCIAL40\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLPARCIAL40\` decimal(10,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLBASE\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLBASE\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`RNU_STATUS\` \`RNU_STATUS\` varchar(1000) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`RNU_STATUS\` \`RNU_STATUS\` varchar(1000) NULL DEFAULT 'N'`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLBASE\``);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLBASE\` double(22) NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLPARCIAL40\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLPARCIAL40\` double(22) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLPARCIAL20\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLPARCIAL20\` double(22) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_VLINTEGRAL\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_VLINTEGRAL\` double(22) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`REQ_ID_CODIGO\` \`REQ_ID_CODIGO\` int NULL COMMENT 'codigo da requisicão originária no transporte'`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`CHAPA\``);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` ADD \`CHAPA\` varchar(10) NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_reqnumerario\` DROP COLUMN \`RNU_ID_CODIGO\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD \`RNU_ID_CODIGO\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` ADD PRIMARY KEY (\`RNU_ID_CODIGO\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`s009_reqnumerario\` CHANGE \`RNU_ID_CODIGO\` \`RNU_ID_CODIGO\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_DTFINAL\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_DTFINAL\` varchar(50) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_DTINICIO\``);
    await queryRunner.query(
      `ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_DTINICIO\` varchar(50) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_VALOR\``);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_VALOR\` double(22) NULL`);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` DROP COLUMN \`UFE_ID_CODIGO\``);
    await queryRunner.query(`ALTER TABLE \`s009_uferpsvalor\` ADD \`UFE_ID_CODIGO\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`senha\``);
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`senha\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`login\``);
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`login\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` DROP COLUMN \`nome\``);
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`nome\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`uniao_estavel\` enum COLLATE "utf8mb4_unicode_ci" ('S', 'N', 'ND') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`id_regional\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_escolaridade\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_regime_casamento\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_estado_civil\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_cnae\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_pais\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`id_orientacao_sexual\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`id_identidade_genero\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_raca\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`sexo\` enum COLLATE "utf8mb4_unicode_ci" ('M', 'F', 'TM', 'TF') NULL COMMENT 'MODIFICADO'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`nome_pai\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`nome_mae\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usu_usuario_cpf\` ADD \`nome_social\` varchar(191) COLLATE "utf8mb4_unicode_ci" NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`dt_nascimento\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`chapa\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_status\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`usu_usuario_cpf\` ADD \`id_sistema\` int NULL`);
    await queryRunner.query(
      `CREATE INDEX \`usu_usuario_cpf_id_regional_fkey\` ON \`usu_usuario_cpf\` (\`id_regional\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`usu_usuario_cpf_id_raca_fkey\` ON \`usu_usuario_cpf\` (\`id_raca\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`usu_usuario_cpf_id_estado_civil_fkey\` ON \`usu_usuario_cpf\` (\`id_estado_civil\`)`,
    );
  }
}
