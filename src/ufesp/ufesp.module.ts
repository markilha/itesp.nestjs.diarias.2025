import { Module } from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { UfespController } from './ufesp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UferpsEntity } from 'src/database/db_mysql/entities/UferpsEntity';

@Module({
  imports:[TypeOrmModule.forFeature([UferpsEntity], 'mysqlConnection')],
  providers: [UfespService],
  controllers: [UfespController],
  exports: [UfespService]
  
})
export class UfespModule {}
