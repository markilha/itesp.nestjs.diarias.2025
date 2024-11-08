import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PrazosService } from './Prazos.service';
import { PrazosDto, FindAllParams } from './PrazosDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';

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
  async findAll(@Query() params: FindAllParams): Promise<PrazosDto[]> {
    return await this.PrazosService.findAll(params);
  }

  @Get('findone')
  async findOne(@Query('PRA_ID_CODIGO') PRA_ID_CODIGO: number): Promise<PrazosDto> {
    const Prazos = await this.PrazosService.findOne(PRA_ID_CODIGO);   
    return Prazos;
  }
 
}
