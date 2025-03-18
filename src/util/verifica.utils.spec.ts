import { verificarDestino } from './verificaDestino';
import { Destino } from './diariaDto';

describe('verificarDestino', () => {
  it('deve retornar DF_MANaus para o Distrito Federal', () => {
    expect(verificarDestino(255)).toBe(Destino.DF_MANaus);
    expect(verificarDestino(9701)).toBe(Destino.DF_MANaus);
  });

  it('deve retornar SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA para municípios específicos de 80%', () => {
    expect(verificarDestino(7107)).toBe(
      Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA,
    );
    expect(verificarDestino(3849)).toBe(
      Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA,
    );
  });

  it('deve retornar DEMAIS_CAPITAIS para as demais capitais', () => {
    expect(verificarDestino(9051)).toBe(Destino.DEMAIS_CAPITAIS);
    expect(verificarDestino(5705)).toBe(Destino.DEMAIS_CAPITAIS);
  });

  it('deve retornar MAIS_DE_200K_HABITANTES_DISTANCIA_70KM para municípios com população >= 200.000', () => {
    expect(verificarDestino(6477)).toBe(Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM);
    expect(verificarDestino(7145)).toBe(Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM);
  });

  it('deve retornar null se o código do município não estiver em nenhuma lista', () => {
    expect(verificarDestino(9999999)).toBe(Destino.OUTRAS_LOCALIDADES);
  });
});
