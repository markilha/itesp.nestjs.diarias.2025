import { DataUtils } from "./DataUtils";

export function calcularValores(SQE_VLSAQUE: number | null | undefined, SQE_VLPREST: number | null | undefined) { 
    const saque = SQE_VLSAQUE ? SQE_VLSAQUE : 0;
    const prestacao = SQE_VLPREST ? SQE_VLPREST : 0; 
    const CALCULO = DataUtils.arredondar(prestacao - saque); 

    const VL_EXTORNO = CALCULO > 0 ? CALCULO : 0;   
    const VL_DEVOLUCAO = CALCULO < 0 ? Math.abs(CALCULO) : 0;  

    return { VL_EXTORNO, VL_DEVOLUCAO };
  }