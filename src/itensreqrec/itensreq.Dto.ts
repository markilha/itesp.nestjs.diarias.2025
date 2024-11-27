import { ApiProperty } from "@nestjs/swagger";



export class paramsItemRecurso {
@ApiProperty()
  CHAPA: string;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
}