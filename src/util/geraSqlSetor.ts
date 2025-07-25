// Função para gerar uma consulta SQL dinâmica para a tabela RM.PSecao
export function gerarSQLSetor({ statusTag, codSecao, cb_setordir, chapa }) {
  // Inicia a query base, buscando registros com CODIGO de tamanho 18
  let sql = `SELECT a.* FROM RM.PSecao a WHERE LENGTH(a.CODIGO) = 18`;

  // Caso statusTag seja 11 ou 12, busca setores que começam com '1.1.' ou '1.6.'
  if ([11, 12].includes(statusTag)) {
    sql += ` AND (a.CODIGO LIKE '1.1.%' OR a.CODIGO LIKE '1.6.%')`;

    // Se statusTag for 0 e estiver em determinadas seções, aplica o mesmo filtro anterior
  } else if (
    statusTag === 0 &&
    (codSecao === '1.1.01.00.00.00.00' || codSecao === '1.0.00.00.00.00.00')
  ) {
    sql += ` AND (a.CODIGO LIKE '1.1.%' OR a.CODIGO LIKE '1.6.%')`;

    // Se statusTag for 0 com seções específicas OU statusTag for 1 ou 2, aplica filtro por raiz
  } else if (
    [1, 2].includes(statusTag) ||
    (statusTag === 0 && (codSecao === '1.2.01.05.01.00.00' || codSecao === '1.2.00.00.00.00.00'))
  ) {
    const setorRaiz = cb_setordir?.substring(0, 5); // Pega o prefixo do código do setor
    sql += ` AND a.CODIGO <> '${cb_setordir}' AND a.CODIGO LIKE '${setorRaiz}%'`;

    // Se statusTag for 3, filtra exatamente pelo código da seção
  } else if (statusTag === 3) {
    sql += ` AND a.CODIGO LIKE '${codSecao}'`;

    // Se statusTag for 6 ou 7, compara diretamente o código
  } else if ([6, 7].includes(statusTag)) {
    sql += ` AND a.CODIGO = '${codSecao}'`;

    // Se statusTag for 4, busca setores que o usuário substitui como chefe
  } else if (statusTag === 4) {
    sql += ` AND a.CODIGO IN (
      SELECT e.CODSECAO 
      FROM RM.PSUBSTCHEFE e 
      WHERE e.CHAPASUBST = '${chapa}' AND e.DATAFIM >= SYSDATE
    )`;

    // Se statusTag for 5, compara diretamente o código
  } else if (statusTag === 5) {
    sql += ` AND a.CODIGO = '${codSecao}'`;
  }

  // Ordena os resultados pela descrição do setor
  sql += ` ORDER BY a.DESCRICAO`;

  // Retorna a string SQL montada
  return sql;
}
