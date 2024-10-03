import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsureqService } from './usureq.service';
import { FindAllParams, UsureqDto } from './usureqDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReturnUserReqDto, ReturnRequiscaoDto } from './returnUserReqDto';


@UseGuards(AuthGuard)
@Controller('usureq2')
export class UsureqController {
  constructor(private readonly usureq: UsureqService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReturnRequiscaoDto[]> {
    return await this.usureq.findAll(params);
  }

  // @Get('saque')
  // async findSaque(@Query() params: FindAllParams): Promise<ReturnUserReqDto> {
  //   return await this.usureq.findSaque(params);
  // }

  @Post()
  async create(@Body() usureqDto: UsureqDto): Promise<UsureqDto> {
    return await this.usureq.create(usureqDto);
  }

  @Delete()
  @HttpCode(200)
  async deleteRequisicao(@Body() dto: UsureqDto): Promise<{ message: string }> {
    return this.usureq.remove(dto);
  }
}
