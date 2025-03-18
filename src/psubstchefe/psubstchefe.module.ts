import { Module } from '@nestjs/common';
import { psubstchefeService } from './psubstchefe.service';
import { psubstchefeController } from './psubstchefe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { psubstchefeEntity } from '../database/db_oracle/entities/psubstchefe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([psubstchefeEntity], 'oracleConnection')],
  providers: [psubstchefeService],
  controllers: [psubstchefeController],
  exports: [psubstchefeService],
})
export class psubstchefeModule {}
