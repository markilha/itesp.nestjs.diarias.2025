import { Module } from '@nestjs/common';
import { documentosService } from './documento.service';
import { documentosController } from './documento.controller';
import { docsEntity } from '../database/db_mysql/entities/docs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([docsEntity], 'mysqlConnection')],
  controllers: [documentosController],
  providers: [documentosService],
  exports: [documentosService],
})
export class documentosModule {}
