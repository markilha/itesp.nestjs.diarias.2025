

export interface FindAllParams {
    nome?: string;
    cargo?: string;  
  }

  export class CargoDto {
    DTD_ID_CODIGO: number;
    DES_ID_CODIGO: number;
    DTD_DESCRICAO: string;
    TDE_ID_CODIGO: number;
    DTD_VALOR_MAX: number;
    CARGO: string;
    NOME: string;
    DES_DESCRICAO: string;
  }