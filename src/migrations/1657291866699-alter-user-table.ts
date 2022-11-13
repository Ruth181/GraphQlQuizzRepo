import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserTable1657291866699 implements MigrationInterface {
  name = 'alterUserTable1657291866699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USER" ADD "jwtRefreshToken" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "jwtRefreshToken"`);
  }
}
