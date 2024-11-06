import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { reqtransService } from './reqtrans.service';
import { FindAllParams, reqtransDto, updateStatusDto } from './reqtransDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { reqtransSwagger } from 'src/swagger/reqtrans.swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';

@UseGuards(AuthGuard)
@ApiTags('reqtrans')
@Controller('reqtrans')
@UseInterceptors(AllExceptionsFilter)
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
  @Get('cancela')
  @ApiOperation({ summary: 'Cancela uma requisicao' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a requisição atualizada',
    type: reqtransDto,
  })
  @ApiQuery({
    name: 'REQ_ID_CODIGO',
    required: true, 
    type: Number,
    description: 'ID da requisição a ser cancelada',
  })
  async updateStatus(@Query() params: { REQ_ID_CODIGO: number }): Promise<reqtransDto> {
    return await this.reqtransService.cancela(params.REQ_ID_CODIGO);
  }
}
