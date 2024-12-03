import { forwardRef, Module } from '@nestjs/common';
import { PcontasService } from './pcontas.service';
import { PcontasController } from './pcontas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pcontasEntity } from '../database/db_oracle/entities/pcontas.entity';
import { PcontasNumModule } from '../pcontasnum/pcontasnum.module';
import { reembolsoModule } from '../reembolso/reembolso.module';
import { extornoModule } from '../extorno/extorno.module';
import { SaqueModule } from '../saque/saque.module';
import { ReqnumerarioModule } from '../reqnumerario/reqnumerario.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([pcontasEntity], 'oracleConnection'),
    PcontasNumModule,
    reembolsoModule,
    extornoModule,
    forwardRef(() => SaqueModule),    
    ReqnumerarioModule,
  ],
  providers: [PcontasService],
  controllers: [PcontasController],
  exports: [PcontasService],
})
export class PcontasModule {}
