import { Controller, Get,Query, UseGuards } from '@nestjs/common';
import { EventosdiariasService } from './eventosdiarias.service';
import { FindAllParams } from './envtosdiariasDto';
import { EventosDiariasEntity } from 'src/database/db_mysql/entities/eventosdiarias.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersDto } from 'src/users/users.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('eventosdiarias')
export class EventosdiariasController {
    constructor(
        private eventosdiariasService: EventosdiariasService
    ) {}

    @Get()
    @ApiExcludeEndpoint()
  async findAll(@CurrentUser() user: UsersDto,@Query() params: FindAllParams): Promise<EventosDiariasEntity[]> {
    
    if(!params.chapa){
      params.chapa = user.chapa;
    }
    return await this.eventosdiariasService.findAll(params);
  }

}
