import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { reqtransService } from './reqtrans.service';
import {  FindAllParams, reqtransDto } from './reqtransDto';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('reqtrans')
export class reqtransController {
  constructor(private readonly reqtransService: reqtransService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<reqtransDto[]> {
    return await this.reqtransService.findAll(params);
  } 
 
}
