import { Injectable } from '@nestjs/common';
import { Destino, enumCargo } from './diariaDto';
import { DataUtils } from './DataUtils';

export interface DiariaCalculada {
  diariaIntegral: number;
  diariaParcial40: number;
  diariaParcial20: number;
}

@Injectable()
export class DiariaService {
  calcularDiaria(
    UFESP: number,
    cargo: string,
    destino: Destino,
    req_pacote: number,
    req_integral: number,
    req_parcial: number,
    horaRetorno: string,
  ): DiariaCalculada {
    try {
      let diariaBase: number;
      // Artigo 2.º - Definir base conforme o cargo
      if (cargo === enumCargo.DIRECAO) {
        diariaBase = 9 * UFESP;
      } else {
        diariaBase = 7 * UFESP;
      }
      // Artigo 3.º - Ajuste da base conforme o destino
      switch (destino) {
        case Destino.DF_MANaus:
          diariaBase *= 2; // 100% - I
          break;
        case Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA:
          diariaBase *= 1.8; // 80% - II
          break;
        case Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM:
          diariaBase *= 1.5; // 50% - IV
          break;
        case Destino.DEMAIS_CAPITAIS:
          diariaBase *= 1.7; // 70% - III
          break;
        case Destino.OUTRAS_LOCALIDADES:
          diariaBase = diariaBase;
          break;
      }

      // Artigo 5 - Sem pernoite

      let diariaParcial40 = 0;
      let diariaParcial20 = 0;
      const horaRetornoDecimal = DataUtils.converterStringParaHora(horaRetorno);

      if (req_parcial > 0) {
        if (horaRetornoDecimal > 19) {
          diariaParcial40 = req_parcial * (diariaBase * 0.4); // 40% se deslocamento >= 12 horas - a
          diariaParcial40 = DataUtils.arredondar(diariaParcial40);
        } else if (horaRetornoDecimal > 13) {
          diariaParcial20 = req_parcial * (diariaBase * 0.2); // 20% se deslocamento entre 6 e 12 horas - b
          diariaParcial20 = DataUtils.arredondar(diariaParcial20);
        }
      }   

      if (req_pacote === 1) {
        diariaBase *= 0.5; // 50%
      }

      let diariaIntegral = 0;

      if (req_integral > 0) {
        diariaIntegral = req_integral * diariaBase;
        diariaIntegral = DataUtils.arredondar(diariaIntegral);
      }
      return {      
        diariaIntegral,
        diariaParcial40,
        diariaParcial20,
      };
    } catch (error) {
      // Captura de erro e resposta amigável
      throw new Error(`Erro ao calcular diária: ${error.message}`);
    }
  }
}
