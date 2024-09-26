import { DF_MA, Municipios80Porcent, DemaisCapitais, Mais200 } from "../dados/municipios";
import { Destino } from "./diariaDto";

// Criar um conjunto (Set) de todos os códigos IBGE para verificar a presença
const dfMaCodigos = new Set(DF_MA);
const municipios80PorcentCodigos = new Set(Municipios80Porcent);
const demaisCapitaisCodigos = new Set(DemaisCapitais);
const mais200Codigos = new Set(Mais200);


export function verificarDestino(codMunicipio: number | undefined): string | null {
 
  if (codMunicipio === undefined || codMunicipio === null) {
    return null; 
  }

  const codMunicipioStr = codMunicipio.toString();

  // Verificar diretamente nos conjuntos
  if (dfMaCodigos.has(codMunicipioStr)) {
    return Destino.DF_MANaus;
  }
  if (municipios80PorcentCodigos.has(codMunicipioStr)) {
    return Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA;
  }
  if (demaisCapitaisCodigos.has(codMunicipioStr)) {
    return Destino.DEMAIS_CAPITAIS;
  }
  if (mais200Codigos.has(codMunicipioStr)) {
    return Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM;
  }


  return Destino.OUTRAS_LOCALIDADES;
}

