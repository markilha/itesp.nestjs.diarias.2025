import { Module } from '@nestjs/common';
import { PfuncaoController } from './pfuncao.controller';
import { PfuncaoService } from './pfuncao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pfuncao } from 'src/database/db_oracle/entities/pfuncao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pfuncao]),
  ],
  controllers: [PfuncaoController],
  providers: [PfuncaoService]
})
export class PfuncaoModule {}
