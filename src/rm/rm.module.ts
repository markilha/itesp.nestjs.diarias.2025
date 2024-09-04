import { Module } from '@nestjs/common';
import { RmController } from './rm.controller';
import { RmService } from './rm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPessoa } from 'src/db_rm/entities/rm.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([PPessoa], 'db_rm'),
  ],
  controllers: [RmController],
  providers: [RmService]
})
export class RmModule {}



