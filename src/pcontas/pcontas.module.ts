import { Module } from '@nestjs/common';
import { PcontasService } from './pcontas.service';
import { PcontasController } from './pcontas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pcontasEntity } from 'src/database/db_oracle/entities/pcontas.entity';
import { PcontasNumModule } from 'src/pcontasnum/pcontasnum.module';

@Module({
  imports: [TypeOrmModule.forFeature([pcontasEntity], 'oracleConnection'), PcontasNumModule],
  providers: [PcontasService],
  controllers: [PcontasController],
  exports: [PcontasService],
})
export class PcontasModule {}
