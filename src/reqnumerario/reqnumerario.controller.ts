import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import {  FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';



@Controller('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  } 

  //get ultimo reqnumerario
  @Get('findlast')
  async findLast(): Promise<number> {
    return await this.reqnumerarioService.findLast();    
  }
}
