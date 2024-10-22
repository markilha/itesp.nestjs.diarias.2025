import { Module } from '@nestjs/common';
import { PpessoaController } from './ppessoa.controller';
import { PpessoaService } from './ppessoa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
import { PFuncEntity } from 'src/database/db_oracle/entities/pfunc.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([PPessoaEntity, PFuncEntity],'oracleConnection'),
  ],
  controllers: [PpessoaController],
  providers: [PpessoaService],
  exports: [PpessoaService]
})
export class PpessoaModule {}



