import { Module } from '@nestjs/common';
import { PrazosService } from './Prazos.service';
import { PrazosController } from './Prazos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/Prazos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PrazosEntity], 'oracleConnection')],
  providers: [PrazosService],
  controllers: [PrazosController],
  exports: [PrazosService]
})
export class PrazosModule {}
