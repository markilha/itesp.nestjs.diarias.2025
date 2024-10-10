import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSaqueDto, FindParamsSaque, RetNumSaque, SaqueDto, PrestacaoDto, SolitarDto } from './saque.dto';
import { SaqueService } from './saque.service';
import { FindAllParams } from 'src/ufesp/ufespDto';

@Controller('saque')
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}

  @Get()
  async findAll(@Query() params: FindParamsSaque): Promise<any> {
    if (!params.CHAPA) {
      throw new HttpException(
        'CHAPA não informada. Por favor, forneça uma CHAPA válida.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.saqueService.findAll(params);
  }

  @Get('prestacao')
  async findPrestacao(
    @Query() params: FindParamsSaque): Promise<PrestacaoDto[]> { 
    if (!params.CHAPA) {
      throw new HttpException(
        'CHAPA não informada. Por favor, forneça uma CHAPA válida.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.saqueService.findPrestacao(params);
      if (result.length === 0) {
        throw new HttpException(
          'Nenhum registro encontrado para a CHAPA fornecida.',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get('prestacao')
  // async findPrestacao(@Query() params: FindParamsSaque): Promise<any> {
  //   return await this.saqueService.findPrestacao(params);
  // }

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

  @Post()
  async create(@Body() createSaqueDto: CreateSaqueDto): Promise<SaqueDto> {
    return this.saqueService.create(createSaqueDto);
  }
  @Post('solicitar')
  async solicitarSaque(@Body() params: SolitarDto): Promise<RetNumSaque> {
    return this.saqueService.solicitarSaque(params);
  }
}
