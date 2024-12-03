import { ApiProperty } from '@nestjs/swagger';


export class FindAllParams {
  @ApiProperty({ required: false })
  NDO_ID_CODIGO:number
  @ApiProperty({ required: false })
  limit?: number;
}
