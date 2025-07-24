import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { RegionaisService } from './regionais.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedRegionaisDto } from './dtos/paginated-regionais.dto';
import { RegionaisDto } from './dtos/regionais.dto';
import { RegionaisParamsDto } from './dtos/regionais-params.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Regionais')
@Controller('regionais')
export class RegionaisController {
  constructor(private readonly service: RegionaisService) {}

  @ApiOperation({ summary: 'Listar todos os regionais' })
  @ApiResponse({ type: () => PaginatedRegionaisDto })
  @Get()
  async findAll(@Query() params: RegionaisParamsDto): Promise<PaginatedRegionaisDto> {
    return this.service.findAll(params).then(
      (result) =>
        new PaginatedRegionaisDto({
          total: result[0],
          data: result[1].map((entity) => new RegionaisDto(entity)),
        }),
    );
  }

  @ApiOperation({ summary: 'Buscar regional pelo id' })
  @ApiResponse({ type: () => RegionaisDto })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RegionaisDto> {
    return await this.service.findOne(id);
  }
}
