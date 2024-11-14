import { DataUtils } from './DataUtils';
import { Destino } from './diariaDto';
import { parse, differenceInMilliseconds } from 'date-fns';

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
  // Horários de referência
  let parcial = 0;
  let h13 = new Date('1970-01-01T13:00:00'); // 13:00
  h13.setHours(h13.getHours() - 3);
  let h19 = new Date('1970-01-01T19:00:00'); // 19:00
  h19.setHours(h19.getHours() - 3);

  // Convertendo a hora de chegada para o tipo Date
  let horaChegadaDate = new Date('1970-01-01T' + horaChegada);
  horaChegadaDate.setHours(horaChegadaDate.getHours() - 3);

  // Situação 3: No dia de retorno à sede.
  if (horaChegadaDate >= h19) {
    parcial = 40; // 40% quando regresso ocorre a partir das 19h.
  } else if (horaChegadaDate >= h13 && horaChegadaDate < h19) {
    parcial = 20; // 20% quando regresso ocorre entre 13h e 19h.
  } else {
    parcial = 0; // 0% quando regresso ocorre antes das 13h ou depois das 19h.
  }

  return parcial;
}

// export function calcularDiariaParcial(horaChegada: string): number {
//   const horaChegadaInt = parseInt(horaChegada);
//   let valorFinal = 20;
//   // Situação 3: No dia de retorno à sede.
//   if (horaChegadaInt >= 19) {
//     valorFinal = 40; // 40% quando regresso ocorre a partir das 19h.
//   } else if (horaChegadaInt >= 13 && horaChegadaInt < 19) {
//     valorFinal = 20; // 20% quando regresso ocorre entre 13h e 19h.
//   } else {
//     valorFinal = 0; // 0% quando regresso ocorre antes das 13h.
//   }
//   return valorFinal;
// }

// export function calcularDiariaIntegral(
//   dataSaida: Date | string,
//   horaSaida: string,
//   dataChegada: Date | string,
//   horaChegada: string,
// ): number {
//   // Convertendo as datas para o tipo Date, se estiverem como strings
//   const dataSaidaFormatada =
//     typeof dataSaida === 'string'
//       ? new Date(`${dataSaida}T${horaSaida}`)
//       : new Date(`${dataSaida.toISOString().split('T')[0]}T${horaSaida}`);
//   const dataChegadaFormatada =
//     typeof dataChegada === 'string'
//       ? new Date(`${dataChegada}T${horaChegada}`)
//       : new Date(`${dataChegada.toISOString().split('T')[0]}T${horaChegada}`);

//   // Verificar se as datas são válidas
//   if (isNaN(dataSaidaFormatada.getTime()) || isNaN(dataChegadaFormatada.getTime())) {
//     throw new Error('Data ou hora inválida');
//   }

//   // Calcular a diferença em milissegundos entre as duas datas
//   const diferencaMilissegundos = dataChegadaFormatada.getTime() - dataSaidaFormatada.getTime();

//   // Converter a diferença em dias (1 dia = 24 * 60 * 60 * 1000 milissegundos)
//   const diferencaDias = diferencaMilissegundos / (24 * 60 * 60 * 1000);

//   // Arredondar para cima para contar qualquer fração de dia como um dia completo
//   const totalDias = Math.ceil(diferencaDias);

//   // Retornar o total de dias, diminuindo um caso seja maior que 1
//   return totalDias > 1 ? totalDias - 1 : totalDias;
// }

export function calcularDiariaIntegral(
  dtSaida: string | Date,
  hoSaida: string,
  dtChegada: string | Date,
  hChegada: string,
  naotrab: number,
): number {
  
  let diariaSemDesconto = calcularDias(dtSaida, hoSaida, dtChegada, hChegada);

  let horaChegada = new Date(`1970-01-01T${hChegada}`);

  horaChegada.setHours(horaChegada.getHours() - 3);
  let diaria: number;

  // Regra nova para calcular a diária
  let diariaReal = diariaSemDesconto - naotrab;

  try {
    diaria = Math.floor(diariaReal); // Tenta converter diretamente
  } catch (e) {
    diaria = Math.floor(diariaSemDesconto - naotrab); // Caso haja erro, faz o cálculo sem a conversão
  }
  let periodo = diariaSemDesconto - naotrab - diaria; // Cálculo do resto

  // Convertendo o período para o formato de hora
  const periodoAtual = new Date(
    '1970-01-01T' + new Date(periodo * 24 * 60 * 60 * 1000).toISOString().slice(11, 19),
  );

  periodoAtual.setHours(periodoAtual.getHours() - 3);

  // Horários de referência
  let h19 = new Date('1970-01-01T06:00:00'); // 19:00
  h19.setHours(h19.getHours() - 3);

  // Convertendo a hora de chegada para o tipo Date
  let horaChegadaDate = new Date('1970-01-01T' + horaChegada);
  horaChegadaDate.setHours(horaChegadaDate.getHours() - 3);

  // Situação 3: No dia de retorno à sede apos as 19h aumenta 1 diaria
  if (horaChegadaDate >= h19) {
    diaria += 1;
  }

  return diaria;
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
    let horaChegada = new Date(`1970-01-01T${horaRetorno}`);

    // Ajustando o fuso horário
    horaChegada.setHours(horaChegada.getHours() - 3);
    let h13 = new Date('1970-01-01T13:00:00'); // 13:00
    h13.setHours(h13.getHours() - 3);
    let h19 = new Date('1970-01-01T19:00:00'); // 19:00
    h19.setHours(h19.getHours() - 3);

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
    let porcentagem = 0;

    if (req_parcial > 0) {
      if (horaChegada >= h19) {
        diariaParcial40 = req_parcial * (diariaBase * 0.4); // 40% se deslocamento >= 12 horas - a
        diariaParcial40 = DataUtils.arredondar(diariaParcial40);
        porcentagem = 40;
      } else if (horaChegada >= h13 && horaChegada < h19) {
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
      VL_DIARIA: DataUtils.arredondar(diaria),
      VL_DIARIA_PARCIAL: Number(diariaParcial40 + diariaParcial20) || 0,
      VL_DIARIA_TOTAL: DataUtils.arredondar(
        Number(diariaParcial40 + diariaParcial20 + diariaIntegral) || 0,
      ),
      PARPERC: porcentagem,
    };
  } catch (error) {
    throw new Error(`Erro ao calcular valores de diárias`);
  }
}

export function calcQuantDiariaIntegralParcialPorcen(dateTimeParams: any, naotrab: number) {
  try {
    const diariaIntegral = calcularDiariaIntegral(
      dateTimeParams.dataSaida,
      dateTimeParams.horaSaida,
      dateTimeParams.dataChegada,
      dateTimeParams.horaChegada,
      naotrab,
    );

    const diaraPorc = calcularDiariaParcial(dateTimeParams.horaChegada);
    const diariaParcial = diaraPorc > 0 ? 1 : 0;
    return { diariaIntegral, diariaParcial, diaraPorc };
  } catch (error) {
    throw new Error(`Ocorreu erro ao calcular quantidade de diarias`);
  }
}

function calcularDias(saida, saidaHora, chegada, chegadaHora) {
  
  const MS_POR_DIA = 1000 * 60 * 60 * 24;
  const datSaida = DataUtils.converterFormatoDataHora(saida, saidaHora);
  const datChegada = DataUtils.converterFormatoDataHora(chegada, chegadaHora);

  try {
    const dataSaida = parse(datSaida, 'yyyy-MM-dd HH:mm:ss', new Date());
    const dataChegada = parse(datChegada, 'yyyy-MM-dd HH:mm:ss', new Date());
    return differenceInMilliseconds(dataChegada, dataSaida) / MS_POR_DIA;
  } catch (error) {
    console.error('Erro ao calcular diferença entre datas:', error);
    return 0;
  }
}






