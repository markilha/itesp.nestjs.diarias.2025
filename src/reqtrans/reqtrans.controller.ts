import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { reqtransService } from './reqtrans.service';
import { FindAllParams, reqtransDto} from './reqtransDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { reqtransSwagger} from 'src/swagger/reqtrans.swagger';

@UseGuards(AuthGuard)
@ApiTags('reqtrans')
@Controller('reqtrans')
export class reqtransController {
  constructor(private readonly reqtransService: reqtransService) {}

  @ApiOperation({ summary: 'Lista todas requisições' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: reqtransSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<reqtransDto[]> {
    return await this.reqtransService.findAll(params);
  }
 
}
