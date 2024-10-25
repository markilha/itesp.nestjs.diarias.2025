import { Module } from '@nestjs/common';
import { PcontasNumService } from './pcontasnum.service';
import { PcontasNumController } from './pcontasnum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pcontasnumEntity } from 'src/database/db_oracle/entities/pcontasnum';

@Module({
  imports:[TypeOrmModule.forFeature([pcontasnumEntity], 'oracleConnection')],
  providers: [PcontasNumService],
  controllers: [PcontasNumController],
  exports: [PcontasNumService]
})
export class PcontasNumModule {}
