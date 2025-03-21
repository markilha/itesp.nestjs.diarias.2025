import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { autorizaService } from './autoriza.service'; // Importa o serviço

import { AuthGuard } from '../auth/auth.guard';
import { FindAllParams } from './autorizaDto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

@ApiTags('autoriza')
@Controller('autoriza')
@UseGuards(AuthGuard)
export class autorizaController {
  constructor(private readonly autorizaService: autorizaService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<{ data: any[]; total: number }> {
    return await this.autorizaService.findAll(params);
  }

  @Get('findrecursos')
  async findre(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllParams,
  ): Promise<{ data: any[]; total: number }> {
    return await this.autorizaService.findRecursos(user, params);
  }
}
