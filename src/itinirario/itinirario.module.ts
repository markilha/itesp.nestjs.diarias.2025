import { Module } from '@nestjs/common';
import { ItinirarioService } from './itinirario.service';
import { ItinirarioController } from './itinirario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerarioEntity } from 'src/database/db_mysql/entities/itinerario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItinerarioEntity],'mysqlConnection')],
  providers: [ItinirarioService],
  controllers: [ItinirarioController],
  exports: [ItinirarioService]
})
export class ItinirarioModule {}
