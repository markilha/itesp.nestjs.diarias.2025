import { Module } from '@nestjs/common';
import { PpessoaController } from './ppessoa.controller';
import { PpessoaService } from './ppessoa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPessoaEntity } from '../database/db_oracle/entities/ppessoa.entity';
import { PFuncEntity } from '../database/db_oracle/entities/pfunc.entity';
import { psubstchefeModule } from '../psubstchefe/psubstchefe.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([PPessoaEntity, PFuncEntity],'oracleConnection'),
    psubstchefeModule
  ],
  controllers: [PpessoaController],
  providers: [PpessoaService],
  exports: [PpessoaService]
})
export class PpessoaModule {}



