import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReqViagemEntity } from 'src/database/db_oracle/entities/reqviagem.entity';
import { ReqviagemController } from './reqviagem.controller';
import { ReqviagemService } from './reqviagem.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReqViagemEntity])],
  controllers: [ReqviagemController],
  providers: [ReqviagemService],
})
export class ReqviagemModule {}
