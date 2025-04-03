export function gerarFiltroStatus(reqStatusParam: string | undefined, campo: string): string {
  let reqStatusArray: string[] = [];
  // Verifica se o parâmetro de status foi passado
  if (reqStatusParam) {
    // Divide a string por vírgula e remove espaços extras
    reqStatusArray = reqStatusParam.split(',').map((status) => status.trim());
  }
  // Retorna a condição para ser usada na query
  return `${campo} IN (${reqStatusArray.map((status) => `'${status}'`).join(', ')})`;
}
