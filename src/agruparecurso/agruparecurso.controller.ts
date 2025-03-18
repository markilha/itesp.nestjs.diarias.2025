import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { agruparecursoService } from './agruparecurso.service';
import { FindAllParams } from './agruparecursoDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { agruparecursoEntity } from 'src/database/db_oracle/entities/agruparecurso.entity';

@ApiTags('agruparecurso')
@UseGuards(AuthGuard)
@Controller('agruparecurso')
@UseInterceptors(AllExceptionsFilter)
export class agruparecursoController {
  constructor(private readonly agruparecursoService: agruparecursoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar agrupamentos de recursos' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de grupos de recursos',
    type: agruparecursoEntity,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Não foi possível buscar grupos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Query() params: FindAllParams): Promise<agruparecursoEntity[]> {
    return await this.agruparecursoService.findAll(params);
  }
  @Post()
  async create(@Body() body: agruparecursoEntity): Promise<agruparecursoEntity> {
    try {
      return await this.agruparecursoService.create(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
