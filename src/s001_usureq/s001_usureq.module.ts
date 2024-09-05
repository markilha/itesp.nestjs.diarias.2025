import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S001Usureq } from 'src/database/db_oracle/entities/usureq.entity';
import { S001UsureqController } from './s001_usureq.controller';
import { S001UsureqService } from './s001_usureq.service';

@Module({
  imports: [TypeOrmModule.forFeature([S001Usureq])],
  controllers: [S001UsureqController],
  providers: [S001UsureqService],
})
export class S001UsureqModule {}
