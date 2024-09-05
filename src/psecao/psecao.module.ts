import { Module } from '@nestjs/common';
import { PsecaoService } from './psecao.service';
import { PsecaoController } from './psecao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psecao } from 'src/database/db_oracle/entities/psecao.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Psecao])
  ],
  providers: [PsecaoService],
  controllers: [PsecaoController]
})
export class PsecaoModule {}
