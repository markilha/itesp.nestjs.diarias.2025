import { isValid, parse } from 'date-fns';


export class DataUtils {

  
static formatarDataParaOracle(data: string): string {
  const [dia, mes, ano] = data.split('/');
  return `${dia}/${mes}/${ano} 00:00:00`; // Inclua horário padrão
}
  // static converterStringParaData(dataString: string): Date {
  //   if (!dataString || dataString.trim() === '') {
  //     return;
  //   }
  //   try {      
      
  //     // Tentar primeiro com o formato completo com hora
  //     let dataConvertida = parse(dataString, 'dd/MM/yyyy HH:mm:ss', new Date());

  //     // Se não for válido, tenta o formato sem a hora
  //     if (!isValid(dataConvertida)) {
  //       dataConvertida = parse(dataString, 'dd/MM/yy', new Date());
  //     }

  //     if (!isValid(dataConvertida)) {
  //       dataConvertida = parse(dataString, 'dd/MM/yyyy', new Date());
  //     }  

  //     if (!isValid(dataConvertida)) {
  //       dataConvertida = parse(dataString, 'yyyy-MM-dd', new Date());
  //     }

  //     // Verificar se o resultado final é válido
  //     if (!isValid(dataConvertida)) {
  //       throw new Error('Data inválida');
  //     }

  //     return dataConvertida;
  //   } catch (error) {      
  //     throw new Error(`${error.message} : ${dataString}`);
  //   }
  // }

  static converterStringParaData(dataString: string): Date | null {
    if (!dataString || dataString.trim() === '') {
      return null; // Retorna null para valores vazios ou inválidos
    }

    const formatos = [
      'd/M/yyyy HH:mm:ss',      // Suporta formatos como 7/4/2003 16:34:37
      'dd/MM/yy HH:mm:ss',      // Suporta formatos como 31/10/03 15:50:30
      'dd/MM/yyyy HH:mm:ss',    // Formato completo
      'd/M/yyyy',               // Para datas como 7/4/2003
      'dd/MM/yy',               // Para datas como 31/10/03
      'dd/MM/yyyy',             // Formato completo sem hora
      'yyyy-MM-dd',             // Formato de data com ano primeiro
    ];

    for (const formato of formatos) {
      const dataConvertida = parse(dataString, formato, new Date());
      if (isValid(dataConvertida)) {
        return dataConvertida; // Retorna a data válida
      }
    }

    // Caso nenhum formato seja válido, retorna null
    return null;
  }
  static normalizarData(data: Date): Date {
   // return new Date(data.getFullYear(), data.getMonth(), data.getDate());
   return new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
  }


  static converterFormatoDataHora(dataString: string, horaString: string) {
    let dataFormada = null;
    let result = '';
    const formatarHora = (hora) => (hora.length < 8 ? hora + ':00' : hora);

    try {
      dataFormada = this.formatDateToStringAmericano(dataString);
    } catch (error) {}

    if (dataFormada) {
      result = `${dataFormada} ${horaString}`;
    } else {
      result = `${dataString.includes(' ') ? dataString.split(' ')[0] : dataString} ${formatarHora(horaString)}`;
    } 
    return result;
  }

  static converterStringParaHora(horaString: string): number {
    try {
      const [hora, minuto] = horaString.split(':').map(Number);
      if (isNaN(hora) || isNaN(minuto)) {
        throw new Error('Hora inválida');
      }
      return hora + minuto / 60; // Retorna hora em decimal
    } catch (error) {
      throw new Error(`Erro ao converter string para hora: ${error.message}`);
    }
  }

  static arredondar(valor: number): number {
    try {
      if (isNaN(valor)) {
        throw new Error('Valor inválido para arredondar');
      }
      return parseFloat(valor.toFixed(2));
    } catch (error) {
      throw new Error(`Erro ao arrendodar valor: ${error.message}`);
    }
  }

  static calcularHorasDeslocamento(
    dataSaida: string,
    horaSaida: string,
    dataRetorno: string,
    horaRetorno: string,
  ): number {
    try {
      // Converter a data do formato dd/MM/yyyy para o formato yyyy-MM-dd
      const [diaSaida, mesSaida, anoSaida] = dataSaida.split('/');
      const [diaRetorno, mesRetorno, anoRetorno] = dataRetorno.split('/');

      const dataSaidaISO = `${anoSaida}-${mesSaida}-${diaSaida}`;
      const dataRetornoISO = `${anoRetorno}-${mesRetorno}-${diaRetorno}`;

      // Combina data e hora de saída e retorno
      const saida = new Date(`${dataSaidaISO}T${horaSaida}`);
      const retorno = new Date(`${dataRetornoISO}T${horaRetorno}`);

      // Verifica se as datas são válidas
      if (isNaN(saida.getTime()) || isNaN(retorno.getTime())) {
        throw new Error('Data ou hora inválida');
      }

      // Calcula a diferença em milissegundos
      const diffMilissegundos = retorno.getTime() - saida.getTime();
      // Converte de milissegundos para horas
      const diffHoras = diffMilissegundos / (1000 * 60 * 60);

      return diffHoras;
    } catch (error) {
      throw new Error(`Erro ao calcular horas de deslocamento: ${error.message}`);
    }
  }

  static formatDateToString(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  static formatDateToStringAmericano(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  static converterParaData(dataString: string) {
    if (!dataString) return null;

    // Define os formatos aceitos
    const formatoDataHora = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const formatoDataAnoCompleto = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const formatoDataAnoCurto = /^(\d{2})\/(\d{2})\/(\d{2})$/;

    let data;

    if (formatoDataHora.test(dataString)) {
      const [dia, mes, ano, hora, minuto, segundo] = dataString.match(formatoDataHora).slice(1);
      data = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`);
    } else if (formatoDataAnoCompleto.test(dataString)) {
      const [dia, mes, ano] = dataString.match(formatoDataAnoCompleto).slice(1);
      data = new Date(`${ano}-${mes}-${dia}`);
    } else if (formatoDataAnoCurto.test(dataString)) {
      const [dia, mes, anoCurto] = dataString.match(formatoDataAnoCurto).slice(1);
      const ano = parseInt(anoCurto) < 50 ? `20${anoCurto}` : `19${anoCurto}`;
      data = new Date(`${ano}-${mes}-${dia}`);
    } else {
      return null;
    }

    // Função auxiliar para adicionar zero à esquerda
    const padZero = (num) => String(num).padStart(2, '0');

    // Retorna a data formatada no padrão desejado
    return (
      `${padZero(data.getDate())}/${padZero(data.getMonth() + 1)}/${data.getFullYear()} ` +
      `${padZero(data.getHours())}:${padZero(data.getMinutes())}:${padZero(data.getSeconds())}`
    );
  }

  static formatarDataAtual = () => {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = String(dataAtual.getFullYear()).slice(-2); // Pega apenas os dois últimos dígitos

    return `${dia}/${mes}/${ano}`;
  };

  static formatarDataAtualString(): string {
    const dataAtual = new Date();

    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // `getMonth` retorna de 0 a 11, então somamos 1
    const ano = dataAtual.getFullYear();

    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }
}

function isValidDateString(dateStr) {
  const formatoData = this.formatDateToString(dateStr);
  if (!formatoData) return false;
  return true;
}


