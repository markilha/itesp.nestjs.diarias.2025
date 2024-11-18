
export function calcularPeriodo(dataFornecida: Date): string {
    // Obter a data e hora atual
    const dataAtual = new Date();
    
    // Calcular a diferença em milissegundos
    const diferenca = dataAtual.getTime() - dataFornecida.getTime();
    
    // Converter a diferença para dias
    const umDia = 24 * 60 * 60 * 1000; // milissegundos em um dia
    
    if (diferenca < umDia) {
        // Se a diferença for menor que um dia, calcular horas e minutos
        const horas = Math.floor(diferenca / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));        
        return `${horas} horas e ${minutos} minutos`;
    } else {
        // Se for maior ou igual a um dia, calcular dias
        const dias = Math.floor(diferenca / umDia);       
        return `${dias} dias`;       
    }
}
