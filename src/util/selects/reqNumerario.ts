export const selecionaReqNumerario = `
  SELECT A.RNU_ID_CODIGO, A.SQE_ID_CODIGO, A.REQ_ID_CODIGO, A.ITE_ID_CODIGO, A.RRE_ID_CODIGO,
         A.DIR_ID_CODIGO, A.RNU_DTINICIO, A.RNU_HORAINICIO, A.RNU_DTFIM, A.RNU_HORAFIM, C.CHAPA,
         A.RNU_MOTIVO, A.RNU_PACOTE, A.RNU_INTPREV, A.RNU_PARPREV, A.RNU_INTREAL, A.RNU_PARREAL,
         D.REQ_STATUS, D.TRA_ID_CODIGO, A.RNU_GOVERNADOR, A.RNU_VLINTEGRAL, A.RNU_VLPARCIAL, 
         A.RNU_VLBASE,  D.REQ_DTSAIDA, D.REQ_DTREQ, D.REQ_HRET,  D.REQ_MOTIVO      
  FROM Financeiro.S009_ReqNumerario A, Financeiro.S009_Saque B, 
       Financeiro.S009_ITENSREQREC C, Transporte.S001_Requisicao D
  WHERE B.SQE_TIPOSAQUE = 'N' AND
        A.SQE_ID_CODIGO = B.SQE_ID_CODIGO AND
        B.ITE_ID_CODIGO = C.ITE_ID_CODIGO AND
        A.REQ_ID_CODIGO = D.REQ_ID_CODIGO        
`;
export class selecinaReqNumerario {
  RNU_ID_CODIGO: number;
  SQE_ID_CODIGO: number;
  REQ_ID_CODIGO: number;
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number;
  RNU_DTINICIO: Date;
  RNU_HORAINICIO: string;
  RNU_DTFIM: Date;
  RNU_HORAFIM: string;
  CHAPA: string;
  RNU_MOTIVO: string;
  RNU_PACOTE: string;
  RNU_INTPREV: number;
  RNU_PARPREV: number;
  RNU_INTREAL: number;
  RNU_PARREAL: number;
  REQ_STATUS: string;
  TRA_ID_CODIGO: number;
  RNU_GOVERNADOR: string;
  RNU_VLINTEGRAL: number;
  RNU_VLPARCIAL: number;
  RNU_VLBASE: number;
  REQ_DTSAIDA: Date;
  REQ_DTREQ: string;
  REQ_HRET: string;
  REQ_MOTIVO: string;
}
