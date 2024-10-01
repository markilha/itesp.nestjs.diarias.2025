import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqNumerarioEntity } from 'src/database/db_mysql/entities/createReqNumerario.entity';
import { SaqueModule } from 'src/saque/saque.module';

@Module({
    imports: [       
        TypeOrmModule.forFeature([CreateReqNumerarioEntity],"mysqlConnection"),
        SaqueModule
    ],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
    exports: [ReqnumerarioService]
})
export class ReqnumerarioModule {}
