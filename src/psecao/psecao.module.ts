import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PsecaoController } from './Psecao.controller';
import { PsecaoService } from './Psecao.service';
import { Psecao } from 'src/database/db_oracle/entities/psecao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Psecao], 'oracleConnection')],
  controllers: [PsecaoController],
  providers: [PsecaoService],
  exports: [PsecaoService],
})
export class PsecaoModule {}
