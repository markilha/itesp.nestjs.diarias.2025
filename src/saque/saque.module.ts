import { Module } from '@nestjs/common';
import { SaqueService } from './saque.service';
import { SaqueController } from './saque.controller';
import {SaqueEntity} from '../database/db_mysql/entities/saque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariaviagemModule } from 'src/diariaviagem/diariaviagem.module';

@Module({
  imports:[TypeOrmModule.forFeature([SaqueEntity], 'mysqlConnection'), DiariaviagemModule],
  providers: [SaqueService],
  controllers: [SaqueController],
  exports: [SaqueService]
})
export class SaqueModule {}
