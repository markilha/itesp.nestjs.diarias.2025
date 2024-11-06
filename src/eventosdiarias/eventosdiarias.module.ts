import { Module } from '@nestjs/common';
import { EventosdiariasService } from './eventosdiarias.service';
import { EventosdiariasController } from './eventosdiarias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosDiariasEntity } from 'src/database/db_oracle/entities/eventosDiaria.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EventosDiariasEntity], 'oracleConnection')],
  providers: [EventosdiariasService],
  controllers: [EventosdiariasController]
})
export class EventosdiariasModule {}
