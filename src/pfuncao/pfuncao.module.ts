import { Module } from '@nestjs/common';
import { PfuncaoController } from './pfuncao.controller';
import { PfuncaoService } from './pfuncao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PfuncaoEntity } from 'src/database/db_oracle/entities/pfuncao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PfuncaoEntity]),
  ],
  controllers: [PfuncaoController],
  providers: [PfuncaoService],
  exports: [PfuncaoService],
})
export class PfuncaoModule {}
