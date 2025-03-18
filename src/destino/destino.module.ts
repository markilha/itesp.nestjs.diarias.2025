import { Module } from '@nestjs/common';
import { destinoService } from './destino.service';
import { destinoController } from './destino.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { destinoEntity } from '../database/db_oracle/entities/destino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([destinoEntity], 'oracleConnection')],
  providers: [destinoService],
  controllers: [destinoController],
  exports: [destinoService],
})
export class destinoModule {}
