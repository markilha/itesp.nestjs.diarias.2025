import { Module } from '@nestjs/common';
import { DespesadiariaService } from './despesadiaria.service';
import { DespesadiariaController } from './despesadiaria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesaDiariaEntity } from 'src/database/db_mysql/entities/despesaDiaria.entity';


@Module({
  imports: [TypeOrmModule.forFeature([DespesaDiariaEntity], 'mysqlConnection')],
  providers: [DespesadiariaService],
  controllers: [DespesadiariaController],
  exports: [DespesadiariaService],
})
export class DespesadiariaModule {}
