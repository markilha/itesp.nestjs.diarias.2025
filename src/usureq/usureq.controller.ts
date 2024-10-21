import { Controller, Get, Query } from '@nestjs/common';
import { UsureqService } from './usureq.service';
import { FindAllParams } from './usureqDto';

@Controller('usureq2')
export class UsureqController {
    constructor(
        private readonly usureqService: UsureqService,
    ) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<any[]> {
      return await this.usureqService.findAll(params);
    }

}
