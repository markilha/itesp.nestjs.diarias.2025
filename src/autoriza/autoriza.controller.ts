import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { autorizaService } from './autoriza.service'; // Importa o serviço

import { AuthGuard } from '../auth/auth.guard';
import { AutorizarPendenteParams, CarreagaSetorDto, FindAllParams } from './autorizaDto';
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

  @Get('saques')
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
  @Get('autorizanega')
  async autorizaRecurso(@Query() params: FindAllParams, @CurrentUser() user: AuthUserDto) {
    return await this.autorizaService.autorizarNega(params, user);
  }
  @Get('pendentes')
  async selAprovaPendente(
    @Query() params: AutorizarPendenteParams,
    @CurrentUser() user: AuthUserDto,
  ) {
    return await this.autorizaService.selAprovaPendente(user, params);
  }
  // @Get('saques')
  // async findSaque(
  //   @CurrentUser() user: AuthUserDto,
  //   @Query() params: FindAllParams,
  // ): Promise<{ data: any[]; total: number }> {
  //   return await this.autorizaService.findSaque(user, params);
  // }
}
