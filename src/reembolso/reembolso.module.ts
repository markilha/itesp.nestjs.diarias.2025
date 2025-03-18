import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { reembolsoController } from './reembolso.controller';
import { reembolsoService } from './reembolso.service';
import { reembolsoEntity } from '../database/db_oracle/entities/reembolso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([reembolsoEntity], 'oracleConnection')],
  controllers: [reembolsoController],
  providers: [reembolsoService],
  exports: [reembolsoService],
})
export class reembolsoModule {}
