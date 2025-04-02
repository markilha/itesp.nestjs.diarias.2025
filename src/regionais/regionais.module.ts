import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegionaisController } from './regionais.controller';
import { RegionaisService } from './regionais.service';
import { RegionalEntity } from '../database/db_oracle/entities/regionalEntity';

@Module({
  imports: [TypeOrmModule.forFeature([RegionalEntity], 'oracleConnection')],
  controllers: [RegionaisController],
  providers: [RegionaisService],
  exports: [RegionaisService],
})
export class RegionaisModule {}
