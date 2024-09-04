import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbUsersModule } from './db_users/db.users.module';
import { S001RequisicaoModule } from './s001_requisicao/s001_requisicao.module';
import { DbReqModule } from './db_requisicao/db.req.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbUsersModule,   
    AuthModule,
    S001RequisicaoModule,
    DbReqModule,   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
