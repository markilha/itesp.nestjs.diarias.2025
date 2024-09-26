import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RmService } from './rm.service';
import { RMPessoaDto,FindAllParams } from './rm.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { returnRmDto } from './returnRmDto';
import { FuncParams, returnFuncDto } from './returnFuncDto';


@UseGuards(AuthGuard) 
@Controller('rm')
export class RmController {

    constructor(private readonly rmService: RmService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<returnRmDto[]> {
      return await this.rmService.findAll(params);
    }
    @Get('func')

    async getFunc(@Query() params: FuncParams): Promise<returnFuncDto[]> {
      return this.rmService.findAllFuncs(params);
    }
    
    @Get('ppesso-func')
    async findPessoaFunc(@Query() params: FindAllParams): Promise<RMPessoaDto[]> {
      return this.rmService.findPessoaWithFunc(params);
    }

}
