import { Module } from '@nestjs/common';
import { itensreqService } from './itensreq.service';
import { itensreqController } from './itensreq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { itensreqEntity } from '../database/db_oracle/entities/itensreq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([itensreqEntity], 'oracleConnection')],
  providers: [itensreqService],
  controllers: [itensreqController],
  exports: [itensreqService],
})
export class itensreqModule {}
