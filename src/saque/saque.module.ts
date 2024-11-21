import { forwardRef, Module } from '@nestjs/common';
import { SaqueService } from './saque.service';
import { SaqueController } from './saque.controller';
import { SaqueEntity } from '../database/db_oracle/entities/saque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariaviagemModule } from '../diariaviagem/diariaviagem.module';
import { PpessoaModule } from '../ppessoa/ppessoa.module';
import { ItinirarioModule } from '../itinirario/itinirario.module';
import { UfespModule } from '../ufesp/ufesp.module';
import { DespesadiariaModule } from '../despesadiaria/despesadiaria.module';
import { MotivodiariaModule } from '../motivodiaria/motivodiaria.module';
import { ReqnumerarioModule } from '../reqnumerario/reqnumerario.module';
import { reembolsoModule } from '../reembolso/reembolso.module';
import { reqtransModule } from '../reqtrans/reqtrans.module';
import { FuncsalarioModule } from '../funcsalario/funcsalario.module';
import { extornoModule } from 'src/extorno/extorno.module';
import { itensreqrecModule } from 'src/itensreqrec/itensreqrec.module';
import { S001RequisicaoModule } from 'src/requisicao/s001_requisicao.module';
import { destinoModule } from 'src/destino/destino.module';
import { naotrabModule } from 'src/naotrab/naotrab.module';
import { documentosModule } from 'src/documentos/documento.module';



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
    reembolsoModule,
    reqtransModule,
    FuncsalarioModule,    
    itensreqrecModule,
    S001RequisicaoModule,
    destinoModule,
    naotrabModule,    
    forwardRef(() => extornoModule),
    documentosModule
    
  ],
  providers: [SaqueService],
  controllers: [SaqueController],
  exports: [SaqueService],
})
export class SaqueModule {}
