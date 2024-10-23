import { DataUtils } from './DataUtils';
import { Destino } from './diariaDto';

export interface DiariaCalculada {
  VL_DIARIA_INTEGRAL: number;
  VL_DIARIA_PARCIAL_40: number;
  VL_DIARIA_PARCIAL_20: number;
  VL_DIARIA_BASE: number;
  VL_DIARIA: number;
  VL_DIARIA_PARCIAL: number;
  VL_DIARIA_TOTAL: number;
  PARPERC: number;
}

export function calcularDiariaParcial(horaChegada: string): number {
  const horaChegadaInt = parseInt(horaChegada);
  let valorFinal = 20;
  // Situação 3: No dia de retorno à sede.
  if (horaChegadaInt >= 19) {
    valorFinal = 40; // 40% quando regresso ocorre a partir das 19h.
  } else if (horaChegadaInt >= 13 && horaChegadaInt < 19) {
    valorFinal = 20; // 20% quando regresso ocorre entre 13h e 19h.
  } else {
    valorFinal = 0; // 0% quando regresso ocorre antes das 13h.
  }

  return valorFinal;
}

export function calcularDiariaIntegral(
  dataSaida: Date,
  horaSaida: string,
  dataChegada: Date,
  horaChegada: string,
): number {
  // Combinar as datas e horas de saída e chegada
  const dataHoraSaida = new Date(`${dataSaida}T${horaSaida}`);
  const dataHoraChegada = new Date(`${dataChegada}T${horaChegada}`);

  // Verificar se as datas são válidas
  if (isNaN(dataHoraSaida.getTime()) || isNaN(dataHoraChegada.getTime())) {
    throw new Error('Data ou hora inválida');
  }

  // Calcular a diferença em milissegundos entre as duas datas
  const diferencaMilissegundos = dataHoraChegada.getTime() - dataHoraSaida.getTime();

  // Converter a diferença em dias (1 dia = 24 * 60 * 60 * 1000 milissegundos)
  const diferencaDias = diferencaMilissegundos / (24 * 60 * 60 * 1000);

  // Arredondar para cima para contar qualquer fração de dia como um dia completo
  const totalDias = Math.ceil(diferencaDias);
  if (totalDias > 1) {
    return totalDias - 1;
  }

  return totalDias;
}

export function calcularDiariaValores(
  UFESP: number,
  cargoUfesp: number,
  destino: Destino,
  req_pacote: number,
  req_integral: number,
  req_parcial: number,
  horaRetorno: string,
): DiariaCalculada {
  try {
    let diariaBase: number;
    // Artigo 2.º - Definir base conforme o cargo
    diariaBase = cargoUfesp * UFESP;
   
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
    let diaria = diariaBase;   

    let diariaParcial40 = 0;
    let diariaParcial20 = 0;
    const horaRetornoDecimal = DataUtils.converterStringParaHora(horaRetorno);

    let porcentagem = 0;

    if (req_parcial > 0) {
      if (horaRetornoDecimal > 19) {
        diariaParcial40 = req_parcial * (diariaBase * 0.4); // 40% se deslocamento >= 12 horas - a
        diariaParcial40 = DataUtils.arredondar(diariaParcial40);
        porcentagem = 40;
      } else if (horaRetornoDecimal > 13) {
        diariaParcial20 = req_parcial * (diariaBase * 0.2); // 20% se deslocamento entre 6 e 12 horas - b
        diariaParcial20 = DataUtils.arredondar(diariaParcial20);
        porcentagem = 20;
      }
    }

    if (req_pacote === 0) {
      diariaBase *= 0.5; // 50%
    }

    let diariaIntegral = 0;

    if (req_integral > 0) {
      diariaIntegral = req_integral * diariaBase;
      diariaIntegral = DataUtils.arredondar(diariaIntegral);
    }
    diariaBase = DataUtils.arredondar(diariaBase);
    return {
      VL_DIARIA_INTEGRAL: diariaIntegral,
      VL_DIARIA_PARCIAL_40: diariaParcial40,
      VL_DIARIA_PARCIAL_20: diariaParcial20,
      VL_DIARIA_BASE: diariaBase,
      VL_DIARIA:DataUtils.arredondar(diaria),
      VL_DIARIA_PARCIAL: Number(diariaParcial40 + diariaParcial20) || 0,
      VL_DIARIA_TOTAL: DataUtils.arredondar( Number(diariaParcial40 + diariaParcial20 + diariaIntegral) || 0),
      PARPERC: porcentagem,
    };
  } catch (error) {
    throw new Error(`Erro ao calcular diária: ${error.message}`);
  }
}
