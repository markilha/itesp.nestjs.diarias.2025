import { Module } from '@nestjs/common';
import { autorizaService } from './autoriza.service';
import { autorizaController } from './autoriza.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import { PpessoaModule } from 'src/ppessoa/ppessoa.module';

@Module({
  imports: [TypeOrmModule.forFeature([autorizaEntity], 'oracleConnection'), PpessoaModule],
  providers: [autorizaService],
  controllers: [autorizaController],
  exports: [autorizaService],
})
export class autorizaModule {}
