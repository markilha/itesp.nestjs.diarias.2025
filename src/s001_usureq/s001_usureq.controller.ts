import { Body, Controller, Delete, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { S001UsureqService } from './s001_usureq.service';
import { FindAllParams, UsureqDto } from './usureqDto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usureq')
export class S001UsureqController {
  constructor(private readonly usureq: S001UsureqService) {}
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<UsureqDto[]> {
    return await this.usureq.findAll(params);
  }

  @Post()
  async create(
    @Body() usureqDto: UsureqDto,
  ): Promise<UsureqDto> {
    return await this.usureq.create(usureqDto);
  }

  @Delete()
  @HttpCode(200)
  async deleteRequisicao(@Body() dto: UsureqDto): Promise<{ message: string }> {
    return this.usureq.remove(dto);
  }
}
