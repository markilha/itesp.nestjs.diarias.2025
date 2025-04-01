import { Module } from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { UfespController } from './ufesp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UfespEntity } from '../database/db_oracle/entities/UfespEntity';

@Module({
  imports: [TypeOrmModule.forFeature([UfespEntity], 'oracleConnection')],
  providers: [UfespService],
  controllers: [UfespController],
  exports: [UfespService],
})
export class UfespModule {}
