import { Module } from '@nestjs/common';
import { PrazosService } from './prazos.service';
import { PrazosController } from './prazos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/prazos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PrazosEntity], 'oracleConnection')],
  providers: [PrazosService],
  controllers: [PrazosController],
  exports: [PrazosService]
})
export class PrazosModule {}
