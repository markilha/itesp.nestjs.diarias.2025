export function sortByField(result, orderBy, orderDirection) {
  if (orderBy) {
    result.sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      // Verifica se o campo é uma string de data
      if (orderBy === 'SQE_DTSAQUE' || orderBy === 'SQE_DTPREST') {
        valueA = valueA ? new Date(valueA) : new Date(0); // Define a data "1970-01-01" se for null
        valueB = valueB ? new Date(valueB) : new Date(0); // Define a data "1970-01-01" se for null

        // Verifica se as datas são válidas
        if (isNaN(valueA.getTime())) valueA = new Date(0); // Data inválida vira "1970-01-01"
        if (isNaN(valueB.getTime())) valueB = new Date(0); // Data inválida vira "1970-01-01"
      }

      // Realiza a comparação
      if (orderDirection === 'DESC') {
        return valueB - valueA; // Para ordem decrescente
      } else {
        return valueA - valueB; // Para ordem crescente
      }
    });
  }
}
