import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PcargoService } from './pcargo.service';
import { PcargoDto, FindAllParams, PcargoDtoUpdate, PcargoDtoCreate } from './pcargoDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';

@ApiTags('pcargo')
@UseGuards(AuthGuard)
@Controller('pcargo')
@UseInterceptors(AllExceptionsFilter)
export class PcargoController {
  constructor(private readonly pcargoService: PcargoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cargos' })
  @ApiResponse({ status: 200, description: 'Listagem de cargos', type: PcargoDto, isArray: true })
  @ApiResponse({ status: 500, description: 'Não foi possível buscar cargos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Query() params: FindAllParams): Promise<PcargoDto[]> {
    return await this.pcargoService.findAll(params);
  }

  @Post('create')
  async create(@Body() pcargoDto: PcargoDtoCreate): Promise<PcargoDto> {
    return await this.pcargoService.create(pcargoDto);
  }

  @Get('codigo')
  async findOne(@Query('codigo') codigo: string): Promise<PcargoDto> {
    const pcargo = await this.pcargoService.findOne(codigo);
    if (!pcargo) {
      throw new HttpException('Cargo Não encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return pcargo;
  }
  //update
  @Put('update')
  async update(@Body() pcargoDto: PcargoDtoUpdate): Promise<PcargoDto> {
    const pcargo = await this.pcargoService.update(pcargoDto);
    return pcargo;
  }
  //delete
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.pcargoService.delete(id);
  }
}
