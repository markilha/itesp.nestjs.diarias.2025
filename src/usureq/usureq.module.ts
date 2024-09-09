import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_oracle/entities/usureq.entity';
import { UsureqController } from './usureq.controller';
import { UsureqService } from './usureq.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuReqEntity])],
  controllers: [UsureqController],
  providers: [UsureqService],
})
export class UsureqModule {}
