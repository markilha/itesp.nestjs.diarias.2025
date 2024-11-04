import { createPcontasDto } from "../pcontasDto";


  export class pcontasDto { 
    PCO_ID_CODIGO?: number;    
    PCO_TIPO: string;  
    PCO_TOTDOC?: number;
  }

  export const mockCreateDto: createPcontasDto = {
    SQE_ID_CODIGO: 123,
    PCO_TIPO: 'A',
    PCO_TOTDOC: 200,
    TOTALCOMPLEMENTAR: 50,
    TOTALDEVOLUCAO: 20,
    JUSTIFICATIVA: 'Reembolso',
    INTREAL: '100.20',
    PARREAL: '150',
  };

 