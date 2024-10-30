import { Module } from '@nestjs/common';
import { PcontasService } from './pcontas.service';
import { PcontasController } from './pcontas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pcontasEntity } from 'src/database/db_oracle/entities/pcontas.entity';
import { PcontasNumModule } from 'src/pcontasnum/pcontasnum.module';
import { reembolsoModule } from 'src/reembolso/reembolso.module';
import { extornoModule } from 'src/extorno/extorno.module';
import { SaqueModule } from 'src/saque/saque.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([pcontasEntity], 'oracleConnection'),
    PcontasNumModule,
    reembolsoModule,
    extornoModule,
    SaqueModule,
  ],
  providers: [PcontasService],
  controllers: [PcontasController],
  exports: [PcontasService],
})
export class PcontasModule {}
