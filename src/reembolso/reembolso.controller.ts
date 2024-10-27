import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { reembolsoService } from './reembolso.service';
import {  FindAllParams, reembolsoDto } from './reembolsoDto';



@Controller('reembolso')
export class reembolsoController {
  constructor(private readonly reembolsoService: reembolsoService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<reembolsoDto[]> {
    return await this.reembolsoService.findAll(params);
  } 
 
}
