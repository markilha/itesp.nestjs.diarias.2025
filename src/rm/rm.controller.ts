import { Controller, Get, Query } from '@nestjs/common';
import { RmService } from './rm.service';
import { RMPessoaDto,FindAllParams } from './rm.dto';


@Controller('rm')
export class RmController {

    constructor(private readonly rmService: RmService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<RMPessoaDto[]> {
      return await this.rmService.findAll(params);
    }

}
