import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PsecaoService } from './psecao.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Psecao } from 'src/database/db_oracle/entities/psecao.entity';
import { FindAllParams } from './psecaoDto';


@UseGuards(AuthGuard)
@Controller('psecao')
export class PsecaoController {
    constructor(
        private readonly psecaoService: PsecaoService,
    ) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<Psecao[]> {
        return await this.psecaoService.findAll(params);
      }
  }
