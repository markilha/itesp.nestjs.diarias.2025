import { Injectable } from '@nestjs/common';
import { Destino, enumCargo } from './diariaDto';
import { DataUtils } from './DataUtils';

@Injectable()
export class DiariaService {
  UFESP = 35.36;

  calcularDiaria(
    cargo: string,
    destino: Destino,
    pernoite = true,
    alojamento = false,
    dataSaida: string,
    horaSaida: string,
    dataRetorno: string,
    horaRetorno: string,
  ): string {
    try {
      let diariaBase: number;
      // Artigo 2.º - Definir base conforme o cargo
      if (cargo === enumCargo.DIRECAO) {
        diariaBase = 9 * this.UFESP;
      } else {
        diariaBase = 7 * this.UFESP;
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

      diariaBase = DataUtils.arredondar(diariaBase);

      const deslocamentoHoras = DataUtils.calcularHorasDeslocamento(
        dataSaida,
        horaSaida,
        dataRetorno,
        horaRetorno,
      );

      // Artigo 5 - Sem pernoite
      if (!pernoite) {
        if (deslocamentoHoras >= 12) {
          diariaBase *= 0.4; // 40% se deslocamento >= 12 horas - a
        } else if (deslocamentoHoras >= 6) {
          diariaBase *= 0.2; // 20% se deslocamento entre 6 e 12 horas - b
        }
        return diariaBase.toFixed(2);
      }

      let diariaParcial = diariaBase; // Valor cheio do último dia
      diariaParcial = DataUtils.arredondar(diariaParcial);

      if (alojamento) {
        diariaBase *= 0.5; // 50%
      }

      // Converter strings de data e hora para objetos Date e número
      const dataSaidaDate = DataUtils.converterStringParaData(dataSaida);
      const dataRetornoDate = DataUtils.converterStringParaData(dataRetorno);
      const horaRetornoDecimal = DataUtils.converterStringParaHora(horaRetorno);

      // Cálculo de total de dias com base nas datas de saída e retorno
      const diffTime = Math.abs(
        dataRetornoDate.getTime() - dataSaidaDate.getTime(),
      );
      const totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Retirada o ultimo dia para calcular a diaria parcial
      let diariaIntegral = diariaBase * (totalDias - 1);
      diariaIntegral = DataUtils.arredondar(diariaIntegral);

      let resultadofinal = '';

      // Artigo 5 - Cálculo específico para o último dia (dia de retorno)
      if (horaRetornoDecimal >= 19) {
        diariaParcial *= 0.4; // 40% se chegar após 19h
        diariaParcial = DataUtils.arredondar(diariaParcial);
        resultadofinal = `1 diaria parcial(40%) = ${diariaParcial}`;
      } else if (horaRetornoDecimal >= 13) {
        diariaParcial *= 0.2; // 20% se chegar entre 13h e 19h
        diariaParcial = DataUtils.arredondar(diariaParcial);
        resultadofinal = `1 diaria parcial(20%) = ${diariaParcial}`;
      } else {
        diariaParcial *= 0.1; // 10% se chegar antes das 13h
        diariaParcial = DataUtils.arredondar(diariaParcial);
        resultadofinal = `1 diaria parcial(10%) = ${diariaParcial}`;
      }

      // Soma o valor do último dia ao total de dias anteriores
      let diariaFinal = diariaIntegral + diariaParcial;

      // console.log(`${totalDias - 1} diarias integral = ${diariaIntegral}`);
      // console.log(resultadofinal);

      return diariaFinal.toFixed(2);
    } catch (error) {
      // Captura de erro e resposta amigável
      throw new Error(`Erro ao calcular diária: ${error.message}`);
    }
  }
}
