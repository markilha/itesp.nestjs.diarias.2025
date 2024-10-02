import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S001RequisicaoController } from './s001_requisicao.controller';
import { S001RequisicaoService } from './s001_requisicao.service';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { UfespModule } from 'src/ufesp/ufesp.module';
import { PcargoModule } from 'src/pcargo/pcargo.module';
import { FuncsalarioModule } from 'src/funcsalario/funcsalario.module';
import { DiariaService } from 'src/util/diaria.service';
import { SaquesMesModule } from 'src/saques-mes/saques-mes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequisicaoEntity], 'mysqlConnection'),
    UfespModule,
    PcargoModule,
    FuncsalarioModule,
    SaquesMesModule
   
  ],
  controllers: [S001RequisicaoController],
  providers: [S001RequisicaoService,DiariaService],
})
export class S001RequisicaoModule {}
