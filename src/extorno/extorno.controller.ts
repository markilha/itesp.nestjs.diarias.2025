import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { extornoService } from './extorno.service';
import { FindAllParams } from './extornoDto';
import { extornoDto } from './extornoDto';


@UseGuards(AuthGuard)
@Controller('extorno')
export class extornoController {
    constructor(private readonly extornoService: extornoService) {}
  
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<extornoDto[]> {
      return await this.extornoService.findAll(params);
    }
    @Get('findone')
    async findOne(@Query() params: FindAllParams): Promise<extornoDto> {      
      return await this.extornoService.findOne(params.SQE_ID_CODIGO);
    }
}
