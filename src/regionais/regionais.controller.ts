import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RegionaisService } from './regionais.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedRegionaisDto } from './dtos/paginated-regionais.dto';
import { RegionaisDto } from './dtos/regionais.dto';
import { RegionaisParamsDto } from './dtos/regionais-params.dto';

@ApiTags('Regionais')
@Controller('regionais')
export class RegionaisController {
  constructor(private readonly service: RegionaisService) {}

  @ApiOperation({ summary: 'Listar todos os regionais' })
  @ApiResponse({ type: () => PaginatedRegionaisDto })
  @Get()
  async findAll(@Query() params: RegionaisParamsDto): Promise<PaginatedRegionaisDto> {
    return await this.service.findAll(params);
  }

  @ApiOperation({ summary: 'Buscar regional pelo id' })
  @ApiResponse({ type: () => RegionaisDto })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RegionaisDto> {
    return await this.service.findOne(id);
  }
}
