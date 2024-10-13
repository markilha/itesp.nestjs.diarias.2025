export function formatDateToYYMM(dateString: string): string {
    const data = new Date(dateString);
    const ano = String(data.getFullYear()).slice(-2); // Obtém os dois últimos dígitos do ano
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Obtém o mês (1 a 12)
    return `${ano}/${mes}`;
}