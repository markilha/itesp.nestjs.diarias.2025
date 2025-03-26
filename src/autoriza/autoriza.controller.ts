import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { autorizaService } from './autoriza.service'; // Importa o serviço

import { AuthGuard } from '../auth/auth.guard';
import { CarreagaSetorDto, FindAllParams } from './autorizaDto';
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
  @Get('carregasetor')
  async carregaSetor(@CurrentUser() user: AuthUserDto): Promise<{ data: CarreagaSetorDto[] }> {
    return await this.autorizaService.carregarSetores(user);
  }
  @Get('autorizarecurso')
  async autorizaRecurso(@Query() params: FindAllParams, @CurrentUser() user: AuthUserDto) {
    return await this.autorizaService.autorizarRecurso(params, user);
  }
}
