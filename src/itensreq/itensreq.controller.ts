import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { itensreqService } from './itensreq.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { itensreqEntity } from 'src/database/db_oracle/entities/itensreq.entity';

@ApiTags('itensreq')
@UseGuards(AuthGuard)
@Controller('itensreq')
@UseInterceptors(AllExceptionsFilter)
export class itensreqController {
  constructor(private readonly itensreqService: itensreqService) {}

  @Post()
  async create(@Body() itensreqDto: itensreqEntity): Promise<itensreqEntity> {
    return await this.itensreqService.create(itensreqDto);
  }
}
