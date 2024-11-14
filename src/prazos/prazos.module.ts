import { Module } from '@nestjs/common';
import { PrazosService } from './prazos.service';
import { PrazosController } from './prazos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/prazos.entity';
import { PpessoaModule } from 'src/ppessoa/ppessoa.module';

@Module({
  imports:[TypeOrmModule.forFeature([PrazosEntity], 'oracleConnection'),
  PpessoaModule],
  providers: [PrazosService],
  controllers: [PrazosController],
  exports: [PrazosService]
})
export class PrazosModule {}
