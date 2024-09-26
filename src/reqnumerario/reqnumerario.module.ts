import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReqNumerarioEntity } from 'src/database/db_oracle/entities/reqnumerario.entity';
import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqNumerarioEntity } from 'src/database/db_mysql/entities/createReqNumerario.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReqNumerarioEntity]),
        TypeOrmModule.forFeature([CreateReqNumerarioEntity],"mysqlConnection"),
    ],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
    exports: [ReqnumerarioService]
})
export class ReqnumerarioModule {}
