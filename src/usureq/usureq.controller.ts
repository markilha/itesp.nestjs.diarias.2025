import { Controller, Get, Query } from '@nestjs/common';
import { UsureqService } from './usureq.service';
import { FindAllParams } from './usureqDto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('usureq2')
export class UsureqController {
    constructor(
        private readonly usureqService: UsureqService,
    ) {}

    @Get()
    @ApiExcludeEndpoint()
    async findAll(@Query() params: FindAllParams): Promise<any[]> {
      return await this.usureqService.findAll(params);
    }

}
