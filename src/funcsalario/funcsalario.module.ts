import { Module } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service';
import { FuncsalarioController } from './funcsalario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncSalarioEntity } from 'src/database/db_mysql/entities/funcsalario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FuncSalarioEntity], 'mysqlConnection')],
  providers: [FuncsalarioService],
  controllers: [FuncsalarioController],
  exports: [FuncsalarioService]
})
export class FuncsalarioModule {}
