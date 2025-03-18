import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PcargoDto {
  @IsNotEmpty()
  @ApiProperty()
  codigo: string;
  @ApiProperty()
  nome: string;
  @ApiProperty()
  ufesp?: number;
}

export class PcargoDtoCreate extends PcargoDto {}

export class PcargoDtoUpdate extends PcargoDto {}

export class FindAllParams {
  @ApiProperty({ required: false })
  codigo?: string;
  @ApiProperty({ required: false })
  nome?: string;
  @ApiProperty({ required: false })
  ufesp?: number;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}
