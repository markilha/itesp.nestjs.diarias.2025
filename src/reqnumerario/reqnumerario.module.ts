import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';
import { ReqNumerarioEntity } from '../database/db_oracle/entities/reqnumerario.entity';


@Module({
    imports: [       
        TypeOrmModule.forFeature([ReqNumerarioEntity],"oracleConnection")   
    ],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
    exports: [ReqnumerarioService]
})
export class ReqnumerarioModule {}
