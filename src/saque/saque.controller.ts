import { Controller, Get, Query } from '@nestjs/common';
import { SaqueService } from './saque.service';
import { FindAllParams, SaqueDto } from './saqueDto';

@Controller('saque')
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<SaqueDto[]> {
    return await this.saqueService.findAll(params);
  }
}
