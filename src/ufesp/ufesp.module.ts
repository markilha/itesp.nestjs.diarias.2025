import { Module } from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { UfespController } from './ufesp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UferpsEntity } from 'src/database/db_oracle/entities/ufesp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UferpsEntity])],
  providers: [UfespService],
  controllers: [UfespController]
})
export class UfespModule {}
