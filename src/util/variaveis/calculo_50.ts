export function calcularSalario50(salarioAtual: number): number {
  const salario50Porcento = salarioAtual / 2 || 0;
  const salario50PorcentoFormatado = salario50Porcento > 0 ? salario50Porcento.toFixed(2) : 0;
  const salario50PorcentoNumber = Number(salario50PorcentoFormatado);
  return salario50PorcentoNumber;
}
