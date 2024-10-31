import { ApiProperty } from "@nestjs/swagger";

export class RMPessoaDto {
    codigo: number;
    nome?: string;  
  
  }

  export class FindAllParams {
    @ApiProperty()
    chapa: string;   
  }
  
  