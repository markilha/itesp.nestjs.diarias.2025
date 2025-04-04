import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUfespDto } from './dto/update-ufesp.dto';
import { CreateUfespDto } from './dto/create-ufesp.dto';
import { UfespDto } from './dto/ufesp.dto';
import { UfespParamsDto } from './dto/ufesp-params.dto';
import { PaginatedUfespDto } from './dto/paginated-ufesp.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RemoveUfespDto } from './dto/remove-ufesp.dto';

@UseGuards(AuthGuard)
@ApiTags('Ufesp')
@Controller('ufesp')
export class UfespController {
  constructor(private readonly ufespService: UfespService) {}

  @ApiOperation({ summary: 'Listar todos os UFESP' })
  @ApiResponse({ type: () => PaginatedUfespDto })
  @Get()
  async findAll(@Query() params: UfespParamsDto): Promise<PaginatedUfespDto> {
    return this.ufespService.findAll(params).then(
      (result) =>
        new PaginatedUfespDto({
          data: result[1].map((entity) => new UfespDto(entity)),
          total: result[0],
          page: +params.page,
          pageCount: Math.ceil(result[0] / params.limit),
          count: result[1].length,
        }),
    );
  }

  @ApiOperation({ summary: 'Buscar ultimo UFESP' })
  @ApiResponse({ type: () => UfespDto })
  @Get('ultimo')
  async getLast(): Promise<UfespDto> {
    return this.ufespService.getLast().then((entity) => new UfespDto(entity));
  }

  @ApiOperation({ summary: 'Buscar UFESP pelo id' })
  @ApiResponse({ type: () => UfespDto })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UfespDto> {
    return this.ufespService.findOne(id).then((entity) => new UfespDto(entity));
  }

  @ApiOperation({ summary: 'Cria um novo UFESP' })
  @ApiResponse({ type: () => UfespDto })
  @Post()
  async create(@Body() payload: CreateUfespDto): Promise<UfespDto> {
    return this.ufespService.create(payload).then((entity) => new UfespDto(entity));
  }

  @ApiOperation({ summary: 'Atualiza um UFESP' })
  @ApiResponse({ type: () => UfespDto })
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: UpdateUfespDto): Promise<UfespDto> {
    return this.ufespService.update(id, payload).then((entity) => new UfespDto(entity));
  }

  @ApiOperation({ summary: 'Remove vários UFESP (ids separados por virgula)' })
  @ApiResponse({ type: () => RemoveUfespDto })
  @Delete('varios')
  async removeVarios(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Promise<RemoveUfespDto> {
    return this.ufespService
      .removeVarios(ids)
      .then((result) => ({ removidos: result.length || 0 }));
  }

  @ApiOperation({ summary: 'Remove um UFESP' })
  @ApiResponse({ type: () => RemoveUfespDto })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<RemoveUfespDto> {
    return this.ufespService.remove(id).then((entity) => ({ removidos: entity ? 1 : 0 }));
  }
}
