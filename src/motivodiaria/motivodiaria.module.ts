import { Module } from '@nestjs/common';
import { MotivodiariaController } from './motivodiaria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotivodiariaEntity } from 'src/database/db_mysql/entities/motivoDiaria.entity';
import { MotivodiariaService } from './motivodiaria.service';

@Module({
  imports: [TypeOrmModule.forFeature([MotivodiariaEntity], 'mysqlConnection')],
  providers: [MotivodiariaService],
  controllers: [MotivodiariaController],
  exports: [MotivodiariaService],
})
export class MotivodiariaModule {}
