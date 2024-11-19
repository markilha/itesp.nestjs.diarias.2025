import { forwardRef, Module } from '@nestjs/common';
import { extornoService } from './extorno.service';
import { extornoController } from './extorno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extornoEntity } from 'src/database/db_oracle/entities/extorno.entity';
import { SaqueModule } from 'src/saque/saque.module';


@Module({
  imports: [TypeOrmModule.forFeature([extornoEntity], 'oracleConnection'),
  forwardRef(() => SaqueModule)],
  providers: [extornoService],
  controllers: [extornoController],
  exports: [extornoService],
})
export class extornoModule {}
