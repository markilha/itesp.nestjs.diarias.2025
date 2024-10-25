import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PcontasService } from './pcontas.service';
import { FindAllParams } from './pcontasDto';
import { pcontasDto } from './pcontasDto';




@UseGuards(AuthGuard)
@Controller('pcontas')
export class PcontasController {
    constructor(private readonly pcontasService: PcontasService) {}
  
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<pcontasDto[]> {
      return await this.pcontasService.findAll(params);
    }
}
