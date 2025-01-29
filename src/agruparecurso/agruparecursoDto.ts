import { ApiProperty } from '@nestjs/swagger';



export class FindAllParams {
  @ApiProperty({ required: false })
  AGS_ID_CODIGO: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO: number;
  @ApiProperty({ required: false })
  TDE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO ?: number; 
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}
