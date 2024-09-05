import { Module } from '@nestjs/common';
import { RmController } from './rm.controller';
import { RmService } from './rm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPessoa } from 'src/database/db_oracle/entities/ppessoa.entity';
import { pFunc } from 'src/database/db_oracle/entities/pfunc.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([PPessoa, pFunc]),
  ],
  controllers: [RmController],
  providers: [RmService]
})
export class RmModule {}



