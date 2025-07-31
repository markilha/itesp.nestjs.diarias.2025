import { ApiProperty } from '@nestjs/swagger';

export type FileDto = {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export class FindAllParams {
  @ApiProperty()
  SQE_ID_CODIGO: number;
}
