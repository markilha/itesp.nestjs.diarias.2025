import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UfespService } from './ufesp.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams, UfespDto } from './ufespDto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Ufesp')
@Controller('ufesp')
export class UfespController {
  constructor(private readonly ufespService: UfespService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<UfespDto[]> {
    return await this.ufespService.findAll(params);
  }
  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createUferpsvalorDto: UfespDto): Promise<UfespDto> {
    return this.ufespService.create(createUferpsvalorDto);
  }
  @ApiExcludeEndpoint()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUferpsvalorDto: UfespDto,
  ): Promise<UfespDto> {
    return this.ufespService.update(updateUferpsvalorDto);
  }
  @ApiExcludeEndpoint()

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ufespService.remove(id);
  }
  @Get('ultimo')
  async findMostRecentValue(): Promise<UfespDto | undefined> {
    return this.ufespService.findMostRecentValue();
  }
}
