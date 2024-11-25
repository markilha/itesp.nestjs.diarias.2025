export function preencherZeros(valor: string | number | null | undefined, casas: number): string {
  if (!valor) {
    return '0'.repeat(casas); // Retorna apenas zeros se o valor for nulo, indefinido ou vazio.
  }
  return valor.toString().padStart(casas, '0');
}

