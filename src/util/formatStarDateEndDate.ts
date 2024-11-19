import { parse, isValid, format, set } from 'date-fns';

export function formatDates(
  startDate: string | null,
  endDate: string | null,
): { startDate: string | null; endDate: string | null } | undefined {
  if (!startDate || !endDate) {
    return undefined; // Retorna undefined se uma das datas for nula ou inválida
  }

  const parseAndFormat = (dateStr: string, time: 'start' | 'end') => {
    let parsedDate;

    // Tenta o formato 'dd/MM/yyyy HH:mm:ss'
    parsedDate = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
    if (!isValid(parsedDate)) {
      // Se falhar, tenta o formato 'dd/MM/yyyy'
      parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    }
    if (!isValid(parsedDate)) {
      // Se falhar, tenta o formato 'dd/MM/yy'
      parsedDate = parse(dateStr, 'dd/MM/yy', new Date());
    }

    // Se a data ainda não for válida, retorna null
    if (!isValid(parsedDate)) return null;

    // Ajusta o horário de acordo com o parâmetro time
    const adjustedDate =
      time === 'start'
        ? set(parsedDate, { hours: 0, minutes: 0, seconds: 0 })
        : set(parsedDate, { hours: 23, minutes: 59, seconds: 59 });

    // Retorna a data formatada como 'dd/MM/yyyy HH:mm:ss'
    return format(adjustedDate, 'dd/MM/yyyy HH:mm:ss');
  };

  const formattedStartDate = parseAndFormat(startDate, 'start');
  const formattedEndDate = parseAndFormat(endDate, 'end');

  // Verifica se ambas as datas são válidas antes de retornar
  if (formattedStartDate && formattedEndDate) {
    return { startDate: formattedStartDate, endDate: formattedEndDate };
  }

  return undefined;
}
