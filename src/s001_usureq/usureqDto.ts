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
  
  