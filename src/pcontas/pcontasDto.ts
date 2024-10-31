import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class pcontasDto {
  
  @IsOptional() 
  @IsNumber()  
  @ApiProperty()
  PCO_ID_CODIGO?: number;

  @IsIn(['N', 'R']) 
  @IsNotEmpty()
  @ApiProperty()
  PCO_TIPO: string;

  @IsNumber()
  @IsOptional() 
  @ApiProperty()
  PCO_TOTDOC?: number;
}

export class createPcontasDto { 
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty({ 
    description: "'N' ou 'R'", 
    enum: ['N', 'R']
  })
  @IsIn(['N', 'R']) 
  PCO_TIPO: string; 
  @ApiProperty()
  PCO_TOTDOC?: number;
  @ApiProperty()
  JUSTIFICATIVA: string;
  @ApiProperty()
  TOTALCOMPLEMENTAR: number;
  @ApiProperty()
  TOTALDEVOLUCAO: number;
  @ApiProperty()
  INTREAL: string;
  @ApiProperty()
  PARREAL: string;
}

export class FindAllParams {
  @ApiProperty({ required: false })
  PCO_ID_CODIGO: number;  
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  limit: number;
}
export class FindOneParams {
  @ApiProperty({ required: false })
  PCO_ID_CODIGO: number;   
}