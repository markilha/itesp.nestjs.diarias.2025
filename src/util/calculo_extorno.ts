import { DataUtils } from "./DataUtils";

export function calcularValores(SQE_VLSAQUE: number | null | undefined, SQE_VLPREST: number | null | undefined) { 
    const saque = SQE_VLSAQUE ? SQE_VLSAQUE : 0;
    const prestacao = SQE_VLPREST ? SQE_VLPREST : 0; 
    const CALCULO = DataUtils.arredondar(prestacao - saque); 
   
   
    if(CALCULO === 0) {
      return {
        VL_COMPLEMENTAR: 0,
        VL_EXTORNO: 0,
        VL_DEVOLUCAO: 0
      };
    }

    if(CALCULO < 0) {
      return {
        VL_COMPLEMENTAR: 0,
        VL_EXTORNO: 0,
        VL_DEVOLUCAO: Math.abs(CALCULO)
      };
    }

    if(CALCULO > 0) {
      return {
        VL_COMPLEMENTAR: CALCULO,
        VL_EXTORNO: Math.abs(CALCULO),
        VL_DEVOLUCAO: 0
      };
    }
  }