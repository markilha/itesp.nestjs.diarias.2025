import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbUsersModule } from './database/db_mysql/db.users.module';
import { S001RequisicaoModule } from './requisicao/s001_requisicao.module';
import { RmModule } from './rm/rm.module';
import { DbOraModule } from './database/db_oracle/db.ora.module';
import { UsureqModule } from './usureq/usureq.module';
import { PfuncaoModule } from './pfuncao/pfuncao.module';
import { PsecaoModule } from './psecao/psecao.module';
import { ReqviagemModule } from './reqviagem/reqviagem.module';

import { ReqnumerarioModule } from './reqnumerario/reqnumerario.module';
import { SaqueModule } from './saque/saque.module';
import { UfespModule } from './ufesp/ufesp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DbOraModule,
    DbUsersModule,
    AuthModule,
    S001RequisicaoModule,
    RmModule,
    UsureqModule,
    PfuncaoModule,
    PsecaoModule,
    ReqviagemModule,
    ReqviagemModule,
    ReqnumerarioModule,
    SaqueModule,
    UfespModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
