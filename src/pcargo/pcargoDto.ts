import { ApiProperty } from "@nestjs/swagger";


export class PcargoDto {
    @ApiProperty()
    codigo: string;
    @ApiProperty()
    nome: string;
    @ApiProperty()
    ufesp?: number;   
}

export class FindAllParams {
    @ApiProperty({ required: false })
    codigo: string;
    @ApiProperty({ required: false })
    nome: string;
    @ApiProperty({ required: false })
    ufesp: number;   
    @ApiProperty({ required: false })
    page: number;
    @ApiProperty({ required: false })
    limit: number;
}