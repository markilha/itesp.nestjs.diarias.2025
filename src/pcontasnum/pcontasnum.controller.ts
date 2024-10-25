import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PcontasNumService } from './pcontasnum.service';
import { FindAllParams } from './pcontasnumDto';
import { pcontasNumDto } from './pcontasnumDto';

@UseGuards(AuthGuard)
@Controller('pcontasnum')
export class PcontasNumController {
    constructor(private readonly pcontasnumService: PcontasNumService) {}
  
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<pcontasNumDto[]> {
      return await this.pcontasnumService.findAll(params);
    }
}
