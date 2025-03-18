import { ApiProperty } from '@nestjs/swagger';
import { docpcontasnumEntity } from '../database/db_oracle/entities/docpcontasnum.entity';

export class FindAllParams {
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  PCO_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  REG_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  CHAPA?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}

export class returnData {
  @ApiProperty({ type: [docpcontasnumEntity] })
  data: docpcontasnumEntity[];
  @ApiProperty()
  total: number;
}
