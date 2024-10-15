import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ItinirarioService } from './itinirario.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams, ItinerarioDto } from './itinerarioDto';

@Controller('itinerario')
export class ItinirarioController {
    constructor(private readonly intinerarioService: ItinirarioService) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<ItinerarioDto[]> {
      return await this.intinerarioService.findAll(params);
    }
}
