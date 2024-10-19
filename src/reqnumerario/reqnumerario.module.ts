import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';
import { ReqNumerarioEntity } from 'src/database/db_mysql/entities/ReqNumerario.entity';


@Module({
    imports: [       
        TypeOrmModule.forFeature([ReqNumerarioEntity],"mysqlConnection")   
    ],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
    exports: [ReqnumerarioService]
})
export class ReqnumerarioModule {}
