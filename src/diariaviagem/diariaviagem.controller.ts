import { Controller, Get,Query } from '@nestjs/common';
import { DiariaviagemService } from './diariaviagem.service';
import { DiariaviagemDto, FindAllParams } from './diariaviagemDto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';


@Controller('diariaviagem')
export class DiariaviagemController {
    constructor(private readonly diariaviagemService: DiariaviagemService) {}

   
    @ApiExcludeEndpoint()
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<DiariaviagemDto[]> {
      return await this.diariaviagemService.findAll(params);
    }

    @Get('findOne')
    @ApiExcludeEndpoint()
    
    async findOne(@Query('REQ_ID_CODIGO') requisicao: number, @Query('CHAPA') chapa: string): Promise<DiariaviagemDto> {
      return await this.diariaviagemService.findOne(requisicao, chapa);
    }
  
}
