import { Module } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service';
import { FuncsalarioController } from './funcsalario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncSalarioEntity } from '../database/db_oracle/entities/funcsalario.entity';
import { SaquesMesModule } from '../saques-mes/saques-mes.module';

@Module({
  imports: [TypeOrmModule.forFeature([FuncSalarioEntity], 'oracleConnection'), SaquesMesModule],
  providers: [FuncsalarioService],
  controllers: [FuncsalarioController],
  exports: [FuncsalarioService],
})
export class FuncsalarioModule {}
