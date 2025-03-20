import { ApiProperty } from '@nestjs/swagger';

export class FindAllParams {
  @ApiProperty({ required: false })
  ITE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO?: number;
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  AUD_AUTORIZA?: string;
}
