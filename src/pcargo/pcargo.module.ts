import { Module } from '@nestjs/common';
import { PcargoService } from './pcargo.service';
import { PcargoController } from './pcargo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcargoEntity } from 'src/database/db_oracle/entities/pcargo.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PcargoEntity], 'oracleConnection')],
  providers: [PcargoService],
  controllers: [PcargoController],
  exports: [PcargoService]
})
export class PcargoModule {}
