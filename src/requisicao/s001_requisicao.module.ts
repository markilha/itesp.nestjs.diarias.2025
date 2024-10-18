import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S001RequisicaoController } from './s001_requisicao.controller';
import { S001RequisicaoService } from './s001_requisicao.service';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { UfespModule } from 'src/ufesp/ufesp.module';
import { FuncsalarioModule } from 'src/funcsalario/funcsalario.module';
import { SaquesMesModule } from 'src/saques-mes/saques-mes.module';
import { DespesadiariaModule } from 'src/despesadiaria/despesadiaria.module';
import { ItinirarioModule } from 'src/itinirario/itinirario.module';
import { RequisicaoModule } from './requisicao.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([RequisicaoEntity], 'mysqlConnection'),
    UfespModule,  
    FuncsalarioModule,
    SaquesMesModule,
    DespesadiariaModule,
    ItinirarioModule,
    RequisicaoModule,
  ],
  controllers: [S001RequisicaoController],
  providers: [S001RequisicaoService],
})
export class S001RequisicaoModule {}
