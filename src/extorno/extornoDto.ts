export class extornoDto {
    SQE_ID_CODIGO: number;
    ITE_ID_CODIGO: number;
    RRE_ID_CODIGO: number;
    DIR_ID_CODIGO: number;
    PCO_ID_CODIGO: number;
    FPA_ID_CODIGO?: number;
    EXT_VALOR?: number;
    EXT_DATA?: string;
    EXT_JUSTIFICA?: string;
  }


  export interface FindAllParams {
    SQE_ID_CODIGO: number; 
    page: number;
    limit: number;
  }
  