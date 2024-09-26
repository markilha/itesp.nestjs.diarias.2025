import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaqueEntity } from 'src/database/db_oracle/entities/saque.entity';
import { SaqueController } from './saque.controller';
import { SaqueService } from './saque.service';

@Module({
    imports: [TypeOrmModule.forFeature([SaqueEntity])],
    controllers: [SaqueController],
    providers: [SaqueService],
})
export class SaqueModule {}
