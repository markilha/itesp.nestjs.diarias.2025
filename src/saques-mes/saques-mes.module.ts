import { Module } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import { SaquesMesController } from './saques-mes.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SaqueMesEntity } from '../database/db_oracle/entities/saqueMes.entity';
@Module({
  imports:[TypeOrmModule.forFeature([SaqueMesEntity], 'oracleConnection')],
  providers: [SaquesMesService],
  controllers: [SaquesMesController],
  exports: [SaquesMesService],
})
export class SaquesMesModule {}
