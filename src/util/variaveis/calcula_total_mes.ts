import { parse, getMonth, getYear, isValid } from 'date-fns';

import { ExtratoDto } from 'src/saques-mes/saque-mesDto';

export function calcularTotalPorYYMM(
    itens: ExtratoDto[],
    yymm: string // formato YY/MM
  ): number {
    const [anoAbrev, mes] = yymm.split('/').map(Number);
  
    // Validações do parâmetro YY/MM
    if (isNaN(anoAbrev) || isNaN(mes) || mes < 1 || mes > 12) {
      throw new Error(`Parâmetro YY/MM inválido: ${yymm}`);
    }
  
    const ano = anoAbrev + 2000; // Ajusta o ano para o formato completo
    const mesZeroBased = mes - 1; // Normaliza o mês para zero-based index
  
    // Filtrar itens pelo mês e ano
    const itensFiltrados = itens.filter((item) => {
      if (!item.DT_CONCEDIDO) {       
        return false;
      }
  
      // Parse da data
      const data = parse(item.DT_CONCEDIDO, 'dd/MM/yyyy HH:mm:ss', new Date());
  
      // Verifica se a data é válida
      if (!isValid(data)) {        
        return false;
      }
  
      return getMonth(data) === mesZeroBased && getYear(data) === ano;
    });
  
    // Calcula o total
    const total = itensFiltrados.reduce((soma, item) => {
      const vlConcedido = item.VL_CONCEDIDO ?? 0; 
      const vlComplemento = item.VL_COMPREMENTO ?? 0;
      const vlDevolucao = item.VL_DEVOLUCAO ?? 0;  
      return soma + (vlConcedido + vlComplemento - vlDevolucao);
    }, 0);
  
    return total;
  }
