import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { SaqueDto } from './saque.dto';
import { SaqueService } from './saque.service';
import { FindAllParams } from 'src/ufesp/ufespDto';

@Controller('saque')
export class SaqueController {
    constructor(private readonly saqueService: SaqueService) {}
    
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<SaqueDto[]> {      
        return await this.saqueService.findAll(params);
    }
    
    @Get(':codigo')
    async findOne(@Param('codigo') codigo: number): Promise<SaqueDto> {
        const saque = await this.saqueService.findOne(codigo);
        if (!saque) {
        throw new HttpException(
            'Saque Não encontrado',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        }
        return saque;
    }
}
