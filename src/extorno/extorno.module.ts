import { Module } from '@nestjs/common';
import { extornoService } from './extorno.service';
import { extornoController } from './extorno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extornoEntity } from 'src/database/db_oracle/entities/extorno.entity';

@Module({
  imports:[TypeOrmModule.forFeature([extornoEntity], 'oracleConnection')],
  providers: [extornoService],
  controllers: [extornoController],
  exports: [extornoService]
})
export class extornoModule {}
