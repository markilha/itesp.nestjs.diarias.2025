import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MotivodiariaService } from './motivodiaria.service';
import { CreateMotivodiariaDto, FindAllParams } from './motivodiariaDto';

@UseGuards(AuthGuard)
@Controller('motivodiaria')
export class MotivodiariaController {
  constructor(private readonly requisicao: MotivodiariaService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<CreateMotivodiariaDto[]> {
    return await this.requisicao.findAll(params);
  }
}
