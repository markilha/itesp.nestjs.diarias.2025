import { Module } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import { SaquesMesController } from './saques-mes.controller';
import { SaqueMesEntity } from 'src/database/db_mysql/entities/saqueMes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([SaqueMesEntity], 'mysqlConnection')],
  providers: [SaquesMesService],
  controllers: [SaquesMesController],
  exports: [SaquesMesService],
})
export class SaquesMesModule {}
