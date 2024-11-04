import { Controller, Get,Query } from '@nestjs/common';
import { EventosdiariasService } from './eventosdiarias.service';
import { EventosDiariasDto, FindAllParams } from './envtosdiariasDto';
import { EventosDiariasEntity } from 'src/database/db_mysql/entities/eventosdiarias.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';


@Controller('eventosdiarias')
export class EventosdiariasController {
    constructor(
        private eventosdiariasService: EventosdiariasService
    ) {}

    @Get()
    @ApiExcludeEndpoint()
  async findAll(@Query() params: FindAllParams): Promise<EventosDiariasEntity[]> {
    return await this.eventosdiariasService.findAll(params);
  }

}
