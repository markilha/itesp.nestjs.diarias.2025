import { Module } from '@nestjs/common';
import { agruparecursoService } from './agruparecurso.service';
import { agruparecursoController } from './agruparecurso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { agruparecursoEntity } from '../database/db_oracle/entities/agruparecurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([agruparecursoEntity], 'oracleConnection')],
  providers: [agruparecursoService],
  controllers: [agruparecursoController],
  exports: [agruparecursoService],
})
export class agruparecursoModule {}
