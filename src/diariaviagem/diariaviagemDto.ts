import { IsOptional, IsString, IsNumber, IsDate, IsDecimal } from 'class-validator';

export class DiariaviagemDto { 
    MDI_ID_CODIGO?: number;      
    REQ_ID_CODIGO?: number;    
    ITE_ID_CODIGO?: number;   
    RRE_ID_CODIGO?: number;
    DIR_ID_CODIGO?: number;   
    PRA_ID_CODIGO?: number;    
    TDE_ID_CODIGO?: number;
    TDE_DESCRICAO?: string;  
    MDI_TIPO?: string;
    MDI_VALOR?: number;
    MDI_CHEFE?: string;   
    MDI_GERENTE?: string;   
    MDI_DIRETOR?: string;   
    MDI_DIREXECUTIVO?: string;  
    MDI_DTAUTORIZA?: Date;
    MDI_JUSTIFICATIVA?: string;   
    CHAPA?: string;   
    NOME?: string;   
    CODSECAO?: string;  
    DESCRICAO?: string;  
   
    REQ_DTSAIDA?: Date;   
    REQ_HSAIDA?: string;   
    REQ_DTRET?: Date;
    REQ_HRET?: string; 
    REQ_KM?: number;  
    REQ_INTEGRAL?: string;
    REQ_PARCIAL?: string;  
    REQ_ESPECIAL?: string;   
    TRA_DESCRICAO?: string;   
    REQ_MOTIVO?: string;
    REQ_GOVERNADOR?: string;
}

export class FindAllParams {  
    CHAPA?: string;   
    NOME?: string;
    REQ_ID_CODIGO?: number;  
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: string;
}
