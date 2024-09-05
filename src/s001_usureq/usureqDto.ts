export class UsureqDto {
    reqIdCodigo: number;    
    codColigada: number;    
    chapa: string;    
    usuMov: string;
  }

  export interface FindAllParams {
    reqIdCodigo: number; 
    page?: number;
    limit?: number;
  }

  export enum TipoUsoMov {
    IDA = 'I',
    VOLTA = 'V',
    IDA_E_VOLTA = 'O',
    RESPONSAVEL = 'R',
    NEGADA = 'N',
  }
  
  
  