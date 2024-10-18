import { Module } from '@nestjs/common';
import { RequisicaoService } from './requisicao.service';
import { RequisicaoController } from './requisicao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requisicao_Entity } from 'src/database/db_mysql/entities/requisicao_.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Requisicao_Entity], 'mysqlConnection')],
  providers: [RequisicaoService],
  controllers: [RequisicaoController],
})
export class RequisicaoModule {}
