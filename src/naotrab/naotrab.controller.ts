import {
  Controller,
  Get,  
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { naotrabService } from './naotrab.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { naotrabEntity } from 'src/database/db_oracle/entities/naotrab.entity';

@ApiTags('naotrab')
@UseGuards(AuthGuard)
@Controller('naotrab')
@UseInterceptors(AllExceptionsFilter)
export class naotrabController {
  constructor(private readonly naotrabService: naotrabService) {} 

  @Get('findone')
  @ApiOperation({ summary: 'Lista as horas não trabalhadas' })
  @ApiResponse({ status: 200, description: 'Listagem de horas não trabalhadas', type: naotrabEntity, isArray: true })
  @ApiResponse({ status: 500, description: 'Não foi possível buscar as horas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Query('REQ_ID_CODIGO') REQ_ID_CODIGO: number): Promise<naotrabEntity> {
    const naotrab = await this.naotrabService.findOne(REQ_ID_CODIGO);   
    return naotrab;
  }
 
}
