import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbUsersModule } from './database/db_mysql/db.users.module';

import { ReqnumerarioModule } from './reqnumerario/reqnumerario.module';
import { UfespModule } from './ufesp/ufesp.module';
import { PcargoModule } from './pcargo/pcargo.module';
import { FuncsalarioModule } from './funcsalario/funcsalario.module';
import { S001RequisicaoModule } from './requisicao/s001_requisicao.module';
import { PpessoaModule } from './ppessoa/ppessoa.module';
import { SaqueModule } from './saque/saque.module';
import { EventosdiariasModule } from './eventosdiarias/eventosdiarias.module';
import { SaquesMesModule } from './saques-mes/saques-mes.module';
import { DiariaviagemModule } from './diariaviagem/diariaviagem.module';
import { MotivodiariaModule } from './motivodiaria/motivodiaria.module';
import { DespesadiariaModule } from './despesadiaria/despesadiaria.module';
import { ItinirarioModule } from './itinirario/itinirario.module';
import { DbOraModule } from './database/db_oracle/db.ora.module';
import { PcontasModule } from './pcontas/pcontas.module';
import { PcontasNumModule } from './pcontasnum/pcontasnum.module';
import { extornoModule } from './extorno/extorno.module';
import { reembolsoModule } from './reembolso/reembolso.module';
import { reqtransModule } from './reqtrans/reqtrans.module';
import { PrazosModule } from './prazos/prazos.module';
import { itensreqrecModule } from './itensreqrec/itensreqrec.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DbUsersModule,
    DbOraModule,
    AuthModule,
    ReqnumerarioModule,
    UfespModule,
    PcargoModule,
    FuncsalarioModule,
    S001RequisicaoModule,
    PpessoaModule,
    SaqueModule,
    EventosdiariasModule,
    SaquesMesModule,
    DiariaviagemModule,
    MotivodiariaModule,
    DespesadiariaModule,
    ItinirarioModule,   
    PcontasModule,
    PcontasNumModule,
    extornoModule,
    reembolsoModule,
    reqtransModule,
    PrazosModule,
    itensreqrecModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
