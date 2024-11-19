import { Module } from '@nestjs/common';
import { itensreqrecService } from './itensreqrec.service';
import { itensreqrecController } from './itensreqrec.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';

@Module({
  imports:[TypeOrmModule.forFeature([itensreqrecEntity], 'oracleConnection')],
  providers: [itensreqrecService],
  controllers: [itensreqrecController],
  exports: [itensreqrecService]
})
export class itensreqrecModule {}
