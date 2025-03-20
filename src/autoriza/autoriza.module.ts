import { Module } from '@nestjs/common';
import { autorizaService } from './autoriza.service';
import { autorizaController } from './autoriza.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([autorizaEntity], 'oracleConnection')],
  providers: [autorizaService],
  controllers: [autorizaController],
  exports: [autorizaService],
})
export class autorizaModule {}
