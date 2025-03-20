import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { auditaPlanejaService } from './auditaPlaneja.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './auditaPlanejaDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auditaplaneja')
@Controller('auditaplaneja')
@UseGuards(AuthGuard)
export class auditaPlanejaController {
  constructor(private readonly auditaPlanejaService: auditaPlanejaService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<{ data: any[]; total: number }> {
    return await this.auditaPlanejaService.findAll(params);
  }
}
