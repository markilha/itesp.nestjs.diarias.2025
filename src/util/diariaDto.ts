// enun
export enum Destino {
    DF_MANaus = 'DF/Manaus',
    SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA = 'São Paulo/Rio de Janeiro/Belo Horizonte/Porto Alegre/Salvador/Recife/Fortaleza',
    DEMAIS_CAPITAIS = 'Demais Capitais',
    MAIS_DE_200K_HABITANTES_DISTANCIA_70KM = 'Mais de 200.000 habitantes e distância >= 70km',
    OUTRAS_LOCALIDADES = 'Outras localidades',
  }

  export enum enumCargo {
    DEMAIS = 'Demais cargos',
    DIRECAO = 'Direção e de Nivel Superior'   
  }

  export interface DiariaCalculadaDto {
    diariaIntegral: number;
    diariaParcial40: number;
    diariaParcial20: number;   
    diariaBase: number; 
  }