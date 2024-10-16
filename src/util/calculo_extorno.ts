import { DataUtils } from "./DataUtils";

export function calcularValores(SQE_VLSAQUE: number | null | undefined, SQE_VLPREST: number | null | undefined) { 
    const saque = SQE_VLSAQUE ? SQE_VLSAQUE : 0;
    const prestacao = SQE_VLPREST ? SQE_VLPREST : 0; 
    const VL_COMPLEMENTAR = DataUtils.arredondar(prestacao - saque); 
   
   
    if(VL_COMPLEMENTAR === 0) {
      return {
        VL_COMPLEMENTAR: 0,
        VL_EXTORNO: 0
      };
    }

    if(VL_COMPLEMENTAR < 0) {
      return {
        VL_COMPLEMENTAR: 0,
        VL_EXTORNO: Math.abs(VL_COMPLEMENTAR)
      };
    }
    if(VL_COMPLEMENTAR > 0) {
      return {
        VL_COMPLEMENTAR,
        VL_EXTORNO: 0
      };
    }
  }