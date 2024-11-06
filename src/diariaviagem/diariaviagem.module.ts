import { Module } from '@nestjs/common';
import { DiariaviagemService } from './diariaviagem.service';
import { DiariaviagemController } from './diariaviagem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariaViagemEntity } from 'src/database/db_oracle/entities/diariaViagem.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DiariaViagemEntity], 'oracleConnection')],
  providers: [DiariaviagemService],
  controllers: [DiariaviagemController],
  exports: [DiariaviagemService]
})
export class DiariaviagemModule {}
