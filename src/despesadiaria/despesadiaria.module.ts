import { Module } from '@nestjs/common';
import { DespesadiariaService } from './despesadiaria.service';
import { DespesadiariaController } from './despesadiaria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesaDiariaEntity } from '../database/db_oracle/entities/despesaDiaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DespesaDiariaEntity], 'oracleConnection')],
  providers: [DespesadiariaService],
  controllers: [DespesadiariaController],
  exports: [DespesadiariaService],
})
export class DespesadiariaModule {}
