import { Module } from '@nestjs/common';
import { SaqueService } from './saque.service';
import { SaqueController } from './saque.controller';
import { SaqueEntity } from '../database/db_oracle/entities/saque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariaviagemModule } from 'src/diariaviagem/diariaviagem.module';
import { PpessoaModule } from 'src/ppessoa/ppessoa.module';
import { ItinirarioModule } from 'src/itinirario/itinirario.module';
import { UfespModule } from 'src/ufesp/ufesp.module';
import { DespesadiariaModule } from 'src/despesadiaria/despesadiaria.module';
import { MotivodiariaModule } from 'src/motivodiaria/motivodiaria.module';
import { ReqnumerarioModule } from 'src/reqnumerario/reqnumerario.module';
import { reembolsoModule } from 'src/reembolso/reembolso.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([SaqueEntity], 'oracleConnection'),
    DiariaviagemModule,
    PpessoaModule,
    ItinirarioModule,
    UfespModule,
    DespesadiariaModule,
    MotivodiariaModule,
    ReqnumerarioModule ,
    reembolsoModule
  ],
  providers: [SaqueService],
  controllers: [SaqueController],
  exports: [SaqueService],
})
export class SaqueModule {}
