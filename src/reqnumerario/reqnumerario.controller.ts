import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqnumerarioDto, FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';

@Controller('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  }

  @Post()
  async createReqNumerario(@Body() body: any) {
    
    const createReqNumerarioDto: CreateReqnumerarioDto = {     
      reqIdCodigo: body.reqIdCodigo,
      sqeIdCodigo: null,
      iteIdCodigo: null,
      rreIdCodigo: null,
      dirIdCodigo: null,
      chapa: body.chapa,
      rnuMotivo: body.reqMotivo,
      rnuDtInicio: new Date(body.reqDtSaida), 
      rnuHoraInicio: body.reqHSaida,
      rnuDtFim: new Date(body.reqDtRetorno),
      rnuHoraFim: body.reqHRet,
      rnuVlIntegral: null,
      rnuVlParcial: null ,
      rnuPacote: body.reqPacote,
      rnuIntPrev: body.reqIntegral, 
      rnuParPrev: body.reqParcial, 
      rnuIntReal: null,
      rnuParReal: null,
      rnuGovernador: null,   
      rnuVlBase: 0, 
    };
   
    return this.reqnumerarioService.create(createReqNumerarioDto);
  }
}
