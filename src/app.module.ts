import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { S001RequisicaoModule } from './s001_requisicao/s001_requisicao.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    UsersModule,
    AuthModule,
    S001RequisicaoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
