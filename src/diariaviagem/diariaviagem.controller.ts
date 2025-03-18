import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DiariaviagemService } from './diariaviagem.service';
import { DiariaviagemDto, FindAllParams } from './diariaviagemDto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('diariaviagem')
@UseGuards(AuthGuard)
export class DiariaviagemController {
  constructor(private readonly diariaviagemService: DiariaviagemService) {}

  @ApiExcludeEndpoint()
  @Get()
  async findAll(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllParams,
  ): Promise<DiariaviagemDto[]> {
    if (!params.CHAPA) {
      params.CHAPA = user.chapa;
    }

    return await this.diariaviagemService.findAll(params);
  }

  @Get('findOne')
  @ApiExcludeEndpoint()
  async findOne(
    @Query('REQ_ID_CODIGO') requisicao: number,
    @Query('CHAPA') chapa: string,
  ): Promise<DiariaviagemDto> {
    return await this.diariaviagemService.findOne(requisicao, chapa);
  }
}
