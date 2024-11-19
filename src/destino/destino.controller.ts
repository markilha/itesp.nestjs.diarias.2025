import {
  Controller, 
  Get, 
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { destinoService } from './destino.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {  ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { destinoEntity } from 'src/database/db_oracle/entities/destino.entity';

@ApiTags('destino')
@UseGuards(AuthGuard)
@Controller('destino')
@UseInterceptors(AllExceptionsFilter)
export class destinoController {
  constructor(private readonly destinoService: destinoService) {}

  @Get('findone')
  async findOne(@Query('REQ_ID_CODIGO') REQ_ID_CODIGO: number): Promise<destinoEntity> {
    const destino = await this.destinoService.findOne(REQ_ID_CODIGO);  
    return destino;
  }
 

}
