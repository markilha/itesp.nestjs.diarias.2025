export const SelecionaDiretoriaGeral = `
Select  a.DIR_ID_CODIGO, a.codigo, a.DESCRICAO,  a.CHAPACHEFE
from Financeiro.V009_DiretoriaGeral A
`;

export const SelecionaSubordina1 = `SELECT 
    A.CODCOLIGADA, 
    A.CODIGO, 
    A.DESCRICAO, 
    A.RUA, 
    A.NUMERO, 
    A.COMPLEMENTO,
    A.BAIRRO, 
    A.ESTADO, 
    A.CIDADE, 
    A.CEP, 
    A.TELEFONE, 
    A.ENDERECOPAGTO,
    A.CONTATO, 
    A.RAMAL, 
    A.DDD, 
    A.Complementogrps1, 
    A.coddepto, 
    B.*, 
    C.TSB1_DESCRICAO, 
    D.REG_DESCRICAO
FROM 
    RM.PSecao A
INNER JOIN 
    COMUM.S000_SUBORDINA1 B ON B.CODIGO = A.CODIGO
INNER JOIN 
    COMUM.S000_Tiposub1 C ON B.TSB1_ID_CODIGO = C.TSB1_ID_CODIGO
INNER JOIN 
    COMUM.S000_REGIONAL D ON B.REG_ID_CODIGO = D.REG_ID_CODIGO`;

export const SelecionaSubordina2 = `
    SELECT 
    A.CODIGO, 
    A.CODCOLIGADA, 
    A.DESCRICAO, 
    A.RUA, 
    A.NUMERO, 
    A.COMPLEMENTO,
    A.BAIRRO, 
    A.ESTADO, 
    A.CIDADE, 
    A.CEP, 
    A.TELEFONE, 
    A.ENDERECOPAGTO,
    A.CONTATO, 
    A.RAMAL, 
    A.DDD,  
    A.Complementogrps1, 
    A.coddepto,
    B.*, 
    C.tsb2_descricao, 
    D.REG_ID_CODIGO
FROM 
    RM.PSecao A
INNER JOIN 
    COMUM.S000_SUBORDINA2 B ON A.CODIGO = B.CODIGO
INNER JOIN 
    COMUM.S000_TIPOSUB2 C ON B.tsb2_id_codigo = C.tsb2_id_codigo
INNER JOIN 
    COMUM.S000_Subordina1 D ON B.sb1_id_codigo = D.sb1_id_codigo
    `;

export const SelecionaSetorRegional = `
SELECT 
    A.CODIGO, 
    A.DESCRICAO, 
    A.DIR_ID_CODIGO, 
    A.REG_ID_CODIGO, 
    A.REG_DESCRICAO
FROM 
    FINANCEIRO.V009_Setorregional A
WHERE 
    A.CODIGO = :setor
`    
export const SelecionaSecao = `
Select * from RM.PSecao
where (Length (CODIGO) = 18) order by descricao
`

export const SelecionaChefe = `
SELECT  
    B.CHAPA, 
    B.NOME, 
    B.CODBANCOPAGTO, 
    B.CODAGENCIAPAGTO,  
    B.CONTAPAGAMENTO, 
    A.CODSECAO, 
    C.CODIGO, 
    C.NOME
FROM 
    RM.PSUBSTCHEFE A,
    RM.PFUNC B,
    RM.PFUNCAO C
WHERE 
    A.CHAPASUBST = B.CHAPA 
    AND B.CODFUNCAO = C.CODIGO 
    AND A.DATAFIM > SYSDATE
`