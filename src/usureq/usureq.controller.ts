import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsureqService } from './usureq.service';
import { FindAllParams, UsureqDto } from './usureqDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReturnRequiscaoDto } from './returnUserReqDto';


@UseGuards(AuthGuard)
@Controller('usureq2')
export class UsureqController {
  constructor(private readonly usureq: UsureqService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReturnRequiscaoDto[]> {
    return await this.usureq.findAll(params);
  }

 

  @Post()
  async create(@Body() usureqDto: UsureqDto): Promise<UsureqDto> {
    return await this.usureq.create(usureqDto);
  }


}
