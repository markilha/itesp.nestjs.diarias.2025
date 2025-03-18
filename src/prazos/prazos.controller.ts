import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { PrazosService } from './prazos.service';
import { PrazosDto, FindAllParams, findPrazosMesDto, returnData } from './prazosDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UsersDto } from 'src/users/users.dto';

@ApiTags('prazos')
@UseGuards(AuthGuard)
@Controller('prazos')
@UseInterceptors(AllExceptionsFilter)
export class PrazosController {
  constructor(private readonly PrazosService: PrazosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prazos dos recursos' })
  @ApiResponse({ status: 200, description: 'Listagem de prazos', type: PrazosDto, isArray: true })
  @ApiResponse({ status: 500, description: 'Não foi possível buscar prazos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Query() params: FindAllParams): Promise<returnData> {
    return await this.PrazosService.findAll(params);
  }

  @Get('findone')
  @ApiResponse({ status: 200, description: 'Listagem de prazos', type: PrazosDto })
  async findOne(@Query('PRA_ID_CODIGO') PRA_ID_CODIGO: number): Promise<PrazosDto> {
    const Prazos = await this.PrazosService.findOne(PRA_ID_CODIGO);
    return Prazos;
  }
  @Get('findmes')
  @ApiResponse({
    status: 200,
    description: 'Listagem de prazos e aplicação do mes atual',
    type: PrazosDto,
    isArray: true,
  })
  async findreg(
    @CurrentUser() user: UsersDto,
    @Query() params: findPrazosMesDto,
  ): Promise<PrazosDto[]> {
    if (!params.chapa) {
      params.chapa = user.chapa;
    }
    const Prazos = await this.PrazosService.findmes(params);
    return Prazos;
  }
}
