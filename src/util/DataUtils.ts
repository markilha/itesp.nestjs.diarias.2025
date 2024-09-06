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
            return parseFloat(valor.toFixed(2));
        } catch (error) {
          throw new Error(`Erro ao arrendodar valor  ${error.message}`);
        }
      }
    
  }
  