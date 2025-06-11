import { ApiProperty } from '@nestjs/swagger';

export class FuncionarioDto {
  @ApiProperty()
  chapa: string;

  @ApiProperty()
  codsecao: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  funcao: string;

  @ApiProperty()
  codfuncao: string;

  @ApiProperty()
  cargo: string;

  @ApiProperty()
  salario: number;

  @ApiProperty()
  setor: string;

  @ApiProperty()
  regIdCodigo: string;

  @ApiProperty()
  regDescricao: string;
}

export interface FindAllFuncionariosDto {
  chapa?: string;
  nome?: string;
  regIdCodigo?: string;
  regDescricao?: string;
  page?: number;
  limit?: number;
}