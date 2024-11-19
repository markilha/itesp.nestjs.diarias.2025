export function converterPacote(pacote: number): string {
  return pacote === 0 ? 'S' : 'N';
}

export function converterParcial(parcial: number): number {
  return parcial > 0 ? 1 : 0;
}
