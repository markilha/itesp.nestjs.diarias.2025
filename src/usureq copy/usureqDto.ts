export class UsureqDto {
    reqIdCodigo: number;    
    codColigada: number;    
    chapa: string;    
    usuMov: string;
  }

  export interface FindAllParams {    
    reqIdCodigo: number; 
    chapa: string;
    usuMov: string;
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

  export class CreateUsureqDto {
    reqIdCodigo: number;    
    codColigada: number =  1;    
    chapa: string;    
    usuMov: string;
  }
  
  
  