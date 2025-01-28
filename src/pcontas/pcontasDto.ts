import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { pcontasEntity } from 'src/database/db_oracle/entities/pcontas.entity';

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

  constructor(pcontas?: Partial<pcontasEntity>) {
    this.PCO_ID_CODIGO = pcontas?.PCO_ID_CODIGO;
    this.PCO_TIPO = pcontas?.PCO_TIPO;
    this.PCO_TOTDOC = pcontas?.PCO_TOTDOC;
  }
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
  PCO_ID_CODIGO?: number;  
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}

export class FindLancDocParams {
  @ApiProperty({ required: false })
  PCO_ID_CODIGO: number;  
  @ApiProperty({ required: false })
  SQE_ID_CODIGO: number;  
}
export class FindOneParams {
  @ApiProperty({ required: false })
  PCO_ID_CODIGO: number;   
}

export const pcontasDtoMock = [
  new pcontasDto({
		"PCO_ID_CODIGO": 1,
		"PCO_TIPO": "N",
		"PCO_TOTDOC": 0
	}),
  new pcontasDto({
    "PCO_ID_CODIGO": 2,
    "PCO_TIPO": "R",
    "PCO_TOTDOC": 0
  }),
]

