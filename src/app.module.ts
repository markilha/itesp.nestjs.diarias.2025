import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbUsersModule } from './database/db_mysql/db.users.module';
import { UsureqModule } from './usureq/usureq.module';
import { ReqnumerarioModule } from './reqnumerario/reqnumerario.module';
import { UfespModule } from './ufesp/ufesp.module';
import { PcargoModule } from './pcargo/pcargo.module';
import { FuncsalarioModule } from './funcsalario/funcsalario.module';
import { S001RequisicaoModule } from './requisicao/s001_requisicao.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), 
    DbUsersModule,
    AuthModule,   
    UsureqModule,  
    ReqnumerarioModule,  
    UfespModule,
    PcargoModule,
    FuncsalarioModule,
    S001RequisicaoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
