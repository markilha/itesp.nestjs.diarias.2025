import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ItinirarioService } from './itinirario.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams, ItinerarioDto } from './itinerarioDto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Itinerario')
@Controller('itinerario')
export class ItinirarioController {
  constructor(private readonly intinerarioService: ItinirarioService) {}
  @UseGuards(AuthGuard)
  @ApiExcludeEndpoint()
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ItinerarioDto[]> {
    return await this.intinerarioService.findAll(params);
  }
  @Get('ultimo')
  async findultimo(@Query() params: FindAllParams): Promise<any> {
    return await this.intinerarioService.findUltimo(params.REQ_ID_CODIGO);
  }
}
