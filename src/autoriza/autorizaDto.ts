import { ApiProperty } from '@nestjs/swagger';

export class FindAllParams {
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  ITE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  STS_ID_CODIGO?: string;
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}
