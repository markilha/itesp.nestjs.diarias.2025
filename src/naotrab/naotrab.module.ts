import { Module } from '@nestjs/common';
import { naotrabService } from './naotrab.service';
import { naotrabController } from './naotrab.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { naotrabEntity } from '../database/db_oracle/entities/naotrab.entity';

@Module({
  imports:[TypeOrmModule.forFeature([naotrabEntity], 'oracleConnection')],
  providers: [naotrabService],
  controllers: [naotrabController],
  exports: [naotrabService]
})
export class naotrabModule {}
