import { MigrationInterface, QueryRunner } from "typeorm";

export class Account1746442749167 implements MigrationInterface {
    name = 'Account1746442749167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."UserAccount_accounttype_enum" AS ENUM('saving', 'current', 'fixed', 'salary')`);
        await queryRunner.query(`CREATE TABLE "UserAccount" ("accountId" SERIAL NOT NULL, "userId" integer NOT NULL, "accountName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountType" "public"."UserAccount_accounttype_enum" array NOT NULL DEFAULT '{saving}', "accountBalance" integer NOT NULL, "intrestRate" character varying NOT NULL, "bankName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_46abec7e07dd17dfba8bee7943f" UNIQUE ("userId"), CONSTRAINT "UQ_c72480b7d681ba5bf592a2a9b9a" UNIQUE ("accountNumber"), CONSTRAINT "PK_766039f58fbf26ced8414bca4ca" PRIMARY KEY ("accountId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "UserAccount"`);
        await queryRunner.query(`DROP TYPE "public"."UserAccount_accounttype_enum"`);
    }

}
