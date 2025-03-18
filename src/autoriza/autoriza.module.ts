import { Module } from '@nestjs/common';
import { autorizaService } from './autoriza.service';
import { autorizaController } from './autoriza.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import { SaquesMesModule } from '../saques-mes/saques-mes.module';

@Module({
  imports: [TypeOrmModule.forFeature([autorizaEntity], 'oracleConnection'), SaquesMesModule],
  providers: [autorizaService],
  controllers: [autorizaController],
  exports: [autorizaService],
})
export class autorizaModule {}
