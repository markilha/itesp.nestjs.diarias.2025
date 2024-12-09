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
// . Verificação Inicial:
// O código verifica se o usuário é um chefe (Assessor, Assistente, Chefe de Gabinete, Diretor).
// Para isso, executa a query DmExt.SelecionaChefe, adicionando filtros com CHAPA do usuário atual (NCHAPA) e um conjunto de códigos de cargo (1, 2, 5, 7, 3, 4, 9).
// 2. Definição de Permissões de Chefes:
// Se o usuário for identificado como chefe (resultado da consulta não vazio), o código verifica o cargo específico (CODIGO) e atribui valores diferentes a Status.Tag:

// 11: Diretor Executivo
// 1: Diretor Adjunto
// 12: Chefe de Gabinete
// 2: Assistente
// 3: Gerente

// Verificação de Responsável Técnico (RT):
// Caso o usuário não seja chefe (resultado da consulta vazio), realiza nova verificação:

// Filtra chefes que não possuem os cargos anteriores.
// Verifica se o usuário é um Responsável Técnico (RT).
// Executa a consulta DmExt.SelecionaSubordina2, buscando informações sobre setores subordinados.
// Com base no setor (CODIGO), define os seguintes níveis:
// 6: Responsável Técnico do Transporte.
// 16: Responsável Técnico do Orçamento.
// 7: Outros responsáveis técnicos
// Também verifica se o usuário pertence ao Grupo Técnico de Campo (GTC) do Departamento Agrário (DA):
// 14: GTC do DA.
// 4: GTC geral.