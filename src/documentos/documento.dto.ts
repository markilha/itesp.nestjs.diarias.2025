import { ApiProperty } from '@nestjs/swagger';



export class UserUpdateDto {
  readonly nome?: string;
  readonly login?: string;
}

export class FindAllParams {
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  NOME_DOCUMENTO?: string; 
}

