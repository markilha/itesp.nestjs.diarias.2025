import { Module } from '@nestjs/common';
import { ndocumentoService } from './ndocumento.service';
import { ndocumentoController } from './ndocumento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ndocumentoEntity } from '../database/db_oracle/entities/ndocumento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ndocumentoEntity], 'oracleConnection')],
  providers: [ndocumentoService],
  controllers: [ndocumentoController],
  exports: [ndocumentoService]
})
export class ndocumentoModule {}
