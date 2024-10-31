export class DataUtils {
  static converterStringParaData(dataString: string): Date {
    try {
      const [dia, mes, ano] = dataString.split('/').map(Number);
      if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        throw new Error('Data inválida');
      }
      return new Date(ano, mes - 1, dia); // No JS, os meses são indexados a partir de 0
    } catch (error) {
      throw new Error(`Erro ao converter string para data: ${error.message}`);
    }
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
      throw new Error(
        `Erro ao calcular horas de deslocamento: ${error.message}`,
      );
    }
  }

  static formatDateToString(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  static converterParaData(dataString:string) {
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
    return `${padZero(data.getDate())}/${padZero(data.getMonth() + 1)}/${data.getFullYear()} ` +
           `${padZero(data.getHours())}:${padZero(data.getMinutes())}:${padZero(data.getSeconds())}`;
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
