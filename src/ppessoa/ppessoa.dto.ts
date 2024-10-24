export class RMPessoaDto {
    codigo: number;
    nome?: string;  
  
  }

  export interface FindAllParams {
    chapa: string;
    nome: string; 
    page?: number;
    limit?: number;
  }
  
  