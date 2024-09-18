import { Module } from '@nestjs/common';
import { RmController } from './rm.controller';
import { RmService } from './rm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
import { PFuncEntity } from 'src/database/db_oracle/entities/pfunc.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([PPessoaEntity, PFuncEntity]),
  ],
  controllers: [RmController],
  providers: [RmService]
})
export class RmModule {}



