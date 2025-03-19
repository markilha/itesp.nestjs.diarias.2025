export const SelecionaPFunc = `
Select A.CHAPA, A.CODCOLIGADA, A.CODSECAO, A.CODFUNCAO, A.NOME,
A.CODPESSOA,A.CODBANCOPAGTO, A.CODAGENCIAPAGTO, A.CONTAPAGAMENTO,  D.CPF,
A.CODSITUACAO, B.CODIGO, B.DESCRICAO, C.CODIGO, C.CARGO, C.NOME, D.EMAIL,E.DIR_ID_CODIGO,
E.REG_ID_CODIGO, e.reg_descricao, TRIM(UPPER(B.CIDADE)) as CIDADE
FROM  RM. PFUNC A, RM.PSECAO B, RM.PFUNCAO C, Rm.Ppessoa D, Financeiro.V009_SetorRegional E
where A.CODSECAO = B.CODIGO AND A.CODFUNCAO = C.CODIGO
AND A.Codpessoa = D.CODIGO
and e.codigo = A.CODSECAO
`;

export const SelecionaFuncSalario = `
select Chapa, CodSecao, NOME, Funcao, codfuncao, cargo, salario,
setor, REG_ID_CODIGO, REG_DESCRICAO
From Financeiro.V009_Funcsalario
`;
export const selecionaPefilFunc = `
 SELECT DISTINCT
        A.CHAPA as CHAPA,
        A.CODSECAO as CODSECAO,
        D.CODIGO as CODIGO,
        UPPER(C.NOME) as NOME,
        C.CPF as CPF,
        C.DTNASCIMENTO as DTNASCIMENTO,
        C.RUA as RUA,
        C.NUMERO as NUMERO,
        C.CEP as CEP,
        C.BAIRRO as BAIRRO,
        C.CIDADE as CIDADE,
        C.ESTADO as ESTADO,
        C.EMAIL as EMAIL,
        C.TELEFONE1 as TELEFONE,       
        E.DESCRICAO as DIRETORIA,
        E.REG_DESCRICAO as REG_DESCRICAO,        
        D.NOME as DESCFUNC,        
        E.REG_ID_CODIGO as REG_ID_CODIGO,
        E.DIR_ID_CODIGO as DIR_ID_CODIGO
      FROM 
        Rm.Pfunc A,
        Rm.Ppessoa C,
        Financeiro.V009_SetorRegional E,
        Rm.Pfuncao D,
        comum.S000_MUNREG F        
      WHERE A.Codpessoa = C.Codigo 
      AND A.Codsecao = E.codigo 
      AND  A.Codfuncao = d.codigo
      AND E.REG_ID_CODIGO = F.REG_ID_CODIGO     
      AND A.CHAPA = :chapa
      `;

export const selecionaFuncs = `
 SELECT DISTINCT
  UPPER(C.NOME) as NOME,
        A.CHAPA as CHAPA,
        A.CODSECAO as CODSECAO,
        D.CODIGO as CODIGO,       
        C.CPF as CPF,
        C.DTNASCIMENTO as DTNASCIMENTO,
        C.RUA as RUA,
        C.NUMERO as NUMERO,
        C.CEP as CEP,
        C.BAIRRO as BAIRRO,
        C.CIDADE as CIDADE,
        C.ESTADO as ESTADO,
        C.EMAIL as EMAIL,
        C.TELEFONE1 as TELEFONE,       
        E.DESCRICAO as DIRETORIA,
        E.REG_DESCRICAO as REG_DESCRICAO,        
        D.NOME as DESCFUNC,        
        E.REG_ID_CODIGO as REG_ID_CODIGO,
        E.DIR_ID_CODIGO as DIR_ID_CODIGO
      FROM 
        Rm.Pfunc A,
        Rm.Ppessoa C,
        Financeiro.V009_SetorRegional E,
        Rm.Pfuncao D,
        comum.S000_MUNREG F        
      WHERE A.Codpessoa = C.Codigo 
      AND A.Codsecao = E.codigo 
      AND  A.Codfuncao = d.codigo
      AND E.REG_ID_CODIGO = F.REG_ID_CODIGO     
     
      `;
