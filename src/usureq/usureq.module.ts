import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_oracle/entities/usureq.entity';
import { UsureqController } from './usureq.controller';
import { UsureqService } from './usureq.service';
import { CreateUsuReqEntity } from 'src/database/db_mysql/entities/createUsureq.entity';
import { DiariaService } from 'src/util/diaria.service';
import { UfespModule } from 'src/ufesp/ufesp.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UsuReqEntity]),
    TypeOrmModule.forFeature([CreateUsuReqEntity], 'mysqlConnection'),   
    UfespModule
  ],
  controllers: [UsureqController],
  providers: [UsureqService, DiariaService],
 
})
export class UsureqModule {}
