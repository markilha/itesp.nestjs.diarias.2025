import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { reqtransController } from './reqtrans.controller';
import { reqtransService } from './reqtrans.service';
import { reqtransEntity } from '../database/db_oracle/entities/requisicaoTrans.entity';



@Module({
    imports: [       
        TypeOrmModule.forFeature([reqtransEntity],"oracleConnection")   
    ],
    controllers: [reqtransController],
    providers: [reqtransService],
    exports: [reqtransService]
})
export class reqtransModule {}
