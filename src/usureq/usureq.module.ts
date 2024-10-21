import { Module } from '@nestjs/common';
import { UsureqService } from './usureq.service';
import { UsureqController } from './usureq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';
import { UfespModule } from 'src/ufesp/ufesp.module';
import { SaquesMesModule } from 'src/saques-mes/saques-mes.module';
import { DespesadiariaModule } from 'src/despesadiaria/despesadiaria.module';
import { FuncsalarioModule } from 'src/funcsalario/funcsalario.module';
import { DiariaviagemModule } from 'src/diariaviagem/diariaviagem.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuReqEntity], 'mysqlConnection'),
    UfespModule,
    SaquesMesModule,
    DespesadiariaModule,
    FuncsalarioModule,
    DiariaviagemModule
  ],
  providers: [UsureqService],
  controllers: [UsureqController],
})
export class UsureqModule {}
