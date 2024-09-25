

export class PcargoDto {
    codigo: string;
    nome: string;
    ufesp?: number;   
}

export interface FindAllParams {
    codigo: string;
    nome: string;
    ufesp: number;   
    page: number;
    limit: number;
}