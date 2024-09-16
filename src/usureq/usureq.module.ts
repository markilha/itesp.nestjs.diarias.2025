import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_oracle/entities/usureq.entity';
import { UsureqController } from './usureq.controller';
import { UsureqService } from './usureq.service';
import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';
import { DiariaService } from 'src/util/diaria.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuReqEntity]),
    TypeOrmModule.forFeature([CreateUsuReqEntity], 'mysqlConnection'),
  ],
  controllers: [UsureqController],
  providers: [UsureqService, DiariaService],
})
export class UsureqModule {}
