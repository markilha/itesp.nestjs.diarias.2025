import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReqNumerarioEntity } from 'src/database/db_oracle/entities/reqnumerario.entity';
import { ReqnumerarioController } from './reqnumerario.controller';
import { ReqnumerarioService } from './reqnumerario.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReqNumerarioEntity])],
    controllers: [ReqnumerarioController],
    providers: [ReqnumerarioService],
})
export class ReqnumerarioModule {}
