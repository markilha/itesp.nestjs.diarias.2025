import { Module } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { FuncionarioController } from './funcionarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionarioEntity } from '../database/db_oracle/entities/funcionario.entity';
import { SaquesMesModule } from '../saques-mes/saques-mes.module';

@Module({
  imports: [TypeOrmModule.forFeature([FuncionarioEntity], 'oracleConnection'), SaquesMesModule],
  providers: [FuncionariosService],
  controllers: [FuncionarioController],
  exports: [FuncionariosService],
})
export class FuncionariosModule {}
