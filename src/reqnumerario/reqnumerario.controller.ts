import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import { FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';

@Controller('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  }
}
