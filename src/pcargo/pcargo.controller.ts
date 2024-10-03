import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PcargoService } from './pcargo.service';
import { PcargoDto, FindAllParams } from './pcargoDto';

@Controller('pcargo')
export class PcargoController {
  constructor(private readonly pcargoService: PcargoService) {}
  
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<PcargoDto[]> {
    return await this.pcargoService.findAll(params);
  }

  @Get('codigo')
  async findOne(@Query('codigo') codigo: string): Promise<PcargoDto> {
    const pcargo = await this.pcargoService.findOne(codigo);
    if (!pcargo) {
      throw new HttpException(
        'Cargo Não encontrado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return pcargo;
  }
}
