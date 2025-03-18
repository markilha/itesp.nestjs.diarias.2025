export function verificarCodigoIBGE(codMunicipio: number, municipios: any[]): boolean {
  const codMunicipioStr = codMunicipio.toString();

  const municipioEncontrado = municipios.some((municipio) =>
    municipio.codigo_ibge.startsWith(codMunicipioStr),
  );

  return municipioEncontrado;
}
