import { Module } from '@nestjs/common';
import { auditaPlanejaService } from './auditaPlaneja.service';
import { auditaPlanejaController } from './auditaPlaneja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { auditaPlanejaEntity } from 'src/database/db_oracle/entities/auditaPlaneja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([auditaPlanejaEntity], 'oracleConnection')],
  providers: [auditaPlanejaService],
  controllers: [auditaPlanejaController],
  exports: [auditaPlanejaService],
})
export class auditaPlanejaModule {}
