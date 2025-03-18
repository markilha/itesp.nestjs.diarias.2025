import { DataUtils } from './DataUtils';

export function calcularValores(
  Valor_Saque: number | null | undefined,
  Valor_prestado: number | null | undefined,
) {
  const saque = Valor_Saque ? Valor_Saque : 0;
  const prestacao = Valor_prestado ? Valor_prestado : 0;
  const CALCULO = DataUtils.arredondar(prestacao - saque);

  const VL_EXTORNO = CALCULO > 0 ? CALCULO : 0;
  const VL_DEVOLUCAO = CALCULO < 0 ? Math.abs(CALCULO) : 0;

  return { VL_EXTORNO, VL_DEVOLUCAO };
}
