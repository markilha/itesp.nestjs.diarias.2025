import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqNumerarioEntity } from 'src/database/db_mysql/entities/createReqNumerario.entity';

@Module({
    imports: [       
        TypeOrmModule.forFeature([CreateReqNumerarioEntity],"mysqlConnection"),
    ],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
    exports: [ReqnumerarioService]
})
export class ReqnumerarioModule {}
