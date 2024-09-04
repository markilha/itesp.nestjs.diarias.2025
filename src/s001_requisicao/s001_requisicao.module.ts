import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { S001RequisicaoController } from './s001_requisicao.controller';
import { S001RequisicaoService } from './s001_requisicao.service';
import { Requisicao } from 'src/db_requisicao/entities/requisicao.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Requisicao], 'db_requisicao'),
  ],
  controllers: [S001RequisicaoController],
  providers: [S001RequisicaoService],
})
export class S001RequisicaoModule {}

