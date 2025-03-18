import { Module } from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { UfespController } from './ufesp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UferpsEntity } from '../database/db_oracle/entities/UferpsEntity';

@Module({
  imports: [TypeOrmModule.forFeature([UferpsEntity], 'oracleConnection')],
  providers: [UfespService],
  controllers: [UfespController],
  exports: [UfespService],
})
export class UfespModule {}
