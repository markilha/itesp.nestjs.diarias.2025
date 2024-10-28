import { Module } from '@nestjs/common';
import { ItinirarioService } from './itinirario.service';
import { ItinirarioController } from './itinirario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerarioEntity } from '../database/db_oracle/entities/itinerario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItinerarioEntity],'oracleConnection')],
  providers: [ItinirarioService],
  controllers: [ItinirarioController],
  exports: [ItinirarioService]
})
export class ItinirarioModule {}
