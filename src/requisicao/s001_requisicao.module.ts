import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S001RequisicaoController } from './s001_requisicao.controller';
import { S001RequisicaoService } from './s001_requisicao.service';

import { UfespModule } from 'src/ufesp/ufesp.module';
import { SaquesMesModule } from 'src/saques-mes/saques-mes.module';
import { ItinirarioModule } from 'src/itinirario/itinirario.module';
import { RequisicaoEntity } from 'src/database/db_oracle/entities/requisicao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequisicaoEntity], 'oracleConnection'),
    UfespModule,
    SaquesMesModule,
    ItinirarioModule,
   
  ],
  controllers: [S001RequisicaoController],
  providers: [S001RequisicaoService],
})
export class S001RequisicaoModule {}
