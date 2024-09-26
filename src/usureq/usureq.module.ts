import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';
import { UsureqController } from './usureq.controller';
import { UsureqService } from './usureq.service';
import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';
import { DiariaService } from 'src/util/diaria.service';
import { UfespModule } from 'src/ufesp/ufesp.module';
import { PfuncaoModule } from 'src/pfuncao/pfuncao.module';
import { ReqnumerarioModule } from 'src/reqnumerario/reqnumerario.module';
import { PcargoModule } from 'src/pcargo/pcargo.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UsuReqEntity],'mysqlConnection'),
    TypeOrmModule.forFeature([CreateUsuReqEntity], 'mysqlConnection'),   
    UfespModule,
    PfuncaoModule,
    ReqnumerarioModule,
    PcargoModule
  ],
  controllers: [UsureqController],
  providers: [UsureqService, DiariaService],
 
})
export class UsureqModule {}
