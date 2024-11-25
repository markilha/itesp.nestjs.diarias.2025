import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MotivodiariaService } from './motivodiaria.service';
import {  FindAllParams, motivoDiariaDto } from './motivodiariaDto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UsersDto } from 'src/users/users.dto';


@UseGuards(AuthGuard)
@Controller('motivodiaria')
export class MotivodiariaController {
  constructor(private readonly requisicao: MotivodiariaService) {} 

  @Get('findone')
  @ApiExcludeEndpoint()
  async findOne(@CurrentUser() user: UsersDto,@Query() params: FindAllParams): Promise<motivoDiariaDto> {
    if(!params.CHAPA ){
      params.CHAPA = user.chapa;
    }
    return await this.requisicao.findOne(params.CHAPA,params.REQ_ID_CODIGO);
  }
}
