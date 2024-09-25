import { Controller, Get,Query } from '@nestjs/common';
import { PcargoService } from './pcargo.service';
import { PcargoDto,FindAllParams } from './pcargoDto';


@Controller('pcargo')
export class PcargoController {
    constructor(
        private readonly pcargoService: PcargoService,
    ) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<PcargoDto[]> {
        return await this.pcargoService.findAll(params);
    }
   
}
