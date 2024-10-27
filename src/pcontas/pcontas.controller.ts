import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PcontasService } from './pcontas.service';
import { FindAllParams } from './pcontasDto';
import { pcontasDto } from './pcontasDto';




@UseGuards(AuthGuard)
@Controller('pcontas')
export class PcontasController {
    constructor(private readonly pcontasService: PcontasService) {}
  
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<pcontasDto[]> {
      return await this.pcontasService.findAll(params);
    }
    @Get('findone')
    async findOne(@Query() params: FindAllParams): Promise<pcontasDto> {      
      return await this.pcontasService.findOne(params.PCO_ID_CODIGO);
    }
    //criar post
    @Post()
    async create(@Body() params: {SQE_ID_CODIGO:number}): Promise<number> {
      return await this.pcontasService.createPcontas(params.SQE_ID_CODIGO);
    }
}
