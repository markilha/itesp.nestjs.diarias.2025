import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbUsersModule } from './database/db_users/db.users.module';
import { S001RequisicaoModule } from './s001_requisicao/s001_requisicao.module';
import { RmModule } from './rm/rm.module';
import { DbOraModule } from './database/db_oracle/db.ora.module';
import { S001UsureqModule } from './s001_usureq/s001_usureq.module';
import { PfuncaoModule } from './pfuncao/pfuncao.module';
import { PsecaoModule } from './psecao/psecao.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbOraModule,
    DbUsersModule,
    AuthModule,
    S001RequisicaoModule,
    RmModule,
    S001UsureqModule,
    PfuncaoModule,
    PsecaoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
