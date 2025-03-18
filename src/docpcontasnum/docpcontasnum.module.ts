import { Module } from '@nestjs/common';
import { docpcontasnumService } from './docpcontasnum.service';
import { docpcontasnumController } from './docpcontasnum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { docpcontasnumEntity } from '../database/db_oracle/entities/docpcontasnum.entity';
import { PpessoaModule } from 'src/ppessoa/ppessoa.module';

@Module({
  imports: [TypeOrmModule.forFeature([docpcontasnumEntity], 'oracleConnection'), PpessoaModule],
  providers: [docpcontasnumService],
  controllers: [docpcontasnumController],
  exports: [docpcontasnumService],
})
export class docpcontasnumModule {}
