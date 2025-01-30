import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { docpcontasnumService } from './docpcontasnum.service';
import { FindAllParams, returnData } from './docpcontasnumDto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../interceptors/all-exceptions.filter';
import { docpcontasnumEntity } from '../database/db_oracle/entities/docpcontasnum.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUserDto } from '../auth/use.auth.Dto';

@ApiTags('docpcontasnum')
@UseGuards(AuthGuard)
@Controller('docpcontasnum')
@UseInterceptors(AllExceptionsFilter)
export class docpcontasnumController {
  constructor(private readonly docpcontasnumService: docpcontasnumService) {}

  @Get()
  @ApiOperation({ summary: 'Listar docpcontasnum dos recursos' })
  @ApiResponse({ status: 200, description: 'Listagem de docpcontasnum', type: returnData })
  @ApiResponse({ status: 500, description: 'Não foi possível buscar docpcontasnum' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@CurrentUser() user: AuthUserDto,@Query() params: FindAllParams): Promise<returnData> {
    if (!params.CHAPA) {
      params.CHAPA = user.chapa;
    }
    return await this.docpcontasnumService.findAll(params,user);
  }

  @Get('findone')
  @ApiResponse({ status: 200, description: 'Listagem de docpcontasnum', type: docpcontasnumEntity })
  async findOne(@Query('SQE_ID_CODIGO') SQE_ID_CODIGO: number): Promise<docpcontasnumEntity> {
    const docpcontasnum = await this.docpcontasnumService.findOne(SQE_ID_CODIGO);
    return docpcontasnum;
  }
}
