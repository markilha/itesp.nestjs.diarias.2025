import { EnumAutorizacao } from '../enums/autorizacao';

export const autorizaSelect = `
        SELECT * FROM (
          SELECT 
            B.SQE_ID_CODIGO AS "SQE_ID_CODIGO",
            B.ITE_ID_CODIGO AS "ITE_ID_CODIGO",
            D.REQ_ID_CODIGO AS "REQ_ID_CODIGO",
            E.CODUSUARIO AS "CHAPA",
            C.NOME AS "NOME",
            E.CPF AS "CPF",
            C.CODSECAO AS "CODSECAO", 
            B.SQE_DTPEDIDO,                    
            B.SQE_VLSAQUE AS "SQE_VLSAQUE",
            B.SQE_VLPREST AS "SQE_VLPREST",
            H.DESCRICAO AS DIRETORIA,
            G.DESCRICAO AS SETOR,  
            J.REG_DESCRICAO AS "REGIONAL",  
            A.IRR_RECURSO AS "RECURSO",     
            CASE 
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.APROVADA}' THEN 'Aprovada'
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.NEGADA}' THEN 'Negada'
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.FINALIZADA}' THEN 'Finalizada'
              ELSE 'Pendente'
            END AS "STATUS",
            ROW_NUMBER() OVER (ORDER BY B.SQE_ID_CODIGO DESC) AS ROW_NUM
          FROM FINANCEIRO.S009_ITENSREQREC A  
          JOIN FINANCEIRO.S009_SAQUE B ON A.ITE_ID_CODIGO = B.ITE_ID_CODIGO
          JOIN RM.PFUNC C ON A.CHAPA = C.CHAPA
          JOIN FINANCEIRO.S009_REQNUMERARIO D ON B.SQE_ID_CODIGO = D.SQE_ID_CODIGO
          JOIN RM.PPESSOA E ON A.CHAPA = E.CODUSUARIO
          JOIN FINANCEIRO.S009_STATUS F ON A.STS_ID_CODIGO = F.STS_ID_CODIGO    
          JOIN RM.PSECAO G ON C.CODSECAO = G.CODIGO   
          JOIN FINANCEIRO.V009_DiretoriaGeral H ON A.DIR_ID_CODIGO = H.DIR_ID_CODIGO
          JOIN FINANCEIRO.V009_FUNCSALARIO I ON A.CHAPA = I.CHAPA
          JOIN COMUM.S000_REGIONAL J  ON I.REG_ID_CODIGO  = J.REG_ID_CODIGO         
      `;

export const SelAprovaPendente = `
Select  a.pra_id_codigo, a.dir_id_codigo, a.codsecao, a.descricao
from financeiro.v009_itensreqrec A
Where a.sts_id_codigo = 5 and a.irr_recurso = 'A'
and a.pra_id_codigo =:prazo
`;
