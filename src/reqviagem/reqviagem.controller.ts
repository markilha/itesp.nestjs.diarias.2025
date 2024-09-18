import { Controller, Get, Query } from '@nestjs/common';
import { ReqviagemService } from './reqviagem.service';
import { FindAllParams, reqviagemDto } from './reqviagemDto';

@Controller('reqviagem')
export class ReqviagemController {
  constructor(private readonly reqviagemService: ReqviagemService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<reqviagemDto[]> {
    return await this.reqviagemService.findAll(params);
  }
}
