
export const selects = {
    extratoMes: `Select a.CHAPA , a.NOME , a.DESCRICAO , a.FUNCAO , a.MESSAQUE , a.TOTSAQUE ,
        a.TOTSAQUEESTCANC , a.MESDEV , a.VLDEVOLUCAO ,  a.SALARIO ,(TOTSAQUE + TotSaqueestcanc) As TotalRealSaque,
        ((TOTSAQUE + TotSaqueestcanc) - VlDevolucao)As totalsaldo, (a.salario/2)as metadesalario,
        b.CODBANCOPAGTO, b.CODAGENCIAPAGTO, b.CONTAPAGAMENTO
        From financeiro.v009_saquesalariogeral a
        INNER JOIN 	RM.PFUNC b ON 	a.CHAPA = b.CHAPA 
`,
    selectExtradoDiario: `
    SELECT 
    c.mesdev, 
    d.chapa, 
    d.nome, 
    e.descricao, 
    f.Funcao, 
    a.MESSAQUE, 
    a.TotSaque,
    NVL(b.TotSaqueestcanc, 0) AS TotSaqueestcanc,
    NVL(c.VlDevolucao, 0) AS VlDevolucao,
    NVL(f.salario, 0) AS salario
FROM 
    Financeiro.V009_Saqueefet_Mes A
    LEFT JOIN financeiro.v009_saqueestcanc_mes B 
        ON a.CHAPA = b.chapa AND a.MESSAQUE = b.MESSAQUE AND a.TDE_ID_CODIGO = b.TDE_ID_CODIGO
    LEFT JOIN Financeiro.V009_DEVOLTOT_MES C 
        ON a.CHAPA = c.CHAPA AND a.TDE_ID_CODIGO = c.TDE_ID_CODIGO
    INNER JOIN Rm.Pfunc D 
        ON a.CHAPA = d.chapa
    INNER JOIN rm.psecao E 
        ON d.codsecao = e.codigo
    LEFT JOIN Financeiro.V009_Funcsalario F 
        ON d.CHAPA = f.Chapa
WHERE 
    A.TDE_ID_CODIGO = 7   
    `,
    funcSalario: `
     Select Chapa, CodSecao, NOME, Funcao, codfuncao, cargo, salario,
        setor, REG_ID_CODIGO, REG_DESCRICAO
        From Financeiro.V009_Funcsalario
    `,
    pfunc: `
    SELECT 
    A.CHAPA, A.CODCOLIGADA, A.CODSECAO, A.CODFUNCAO, A.NOME, A.CODPESSOA, A.CODBANCOPAGTO, A.CODAGENCIAPAGTO, A.CONTAPAGAMENTO,
    D.CPF, A.CODSITUACAO, B.CODIGO AS CODSECAO_CODIGO, B.DESCRICAO AS SECAO_DESCRICAO, C.CODIGO AS CODFUNCAO_CODIGO,
    C.CARGO, C.NOME AS FUNCAO_NOME, D.EMAIL, E.DIR_ID_CODIGO, E.REG_ID_CODIGO, E.REG_DESCRICAO, TRIM(UPPER(B.CIDADE)) AS CIDADE
    FROM 
    RM.PFUNC A
    INNER JOIN RM.PSECAO B ON A.CODSECAO = B.CODIGO
    INNER JOIN RM.PFUNCAO C ON A.CODFUNCAO = C.CODIGO
    INNER JOIN RM.PPESSOA D ON A.CODPESSOA = D.CODIGO
    INNER JOIN FINANCEIRO.V009_SETORREGIONAL E ON E.CODIGO = A.CODSECAO
    `,

    
    



}