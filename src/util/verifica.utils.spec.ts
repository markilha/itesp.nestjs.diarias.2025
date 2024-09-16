import { verificarDestino } from './verificaDestino';
import { Destino } from './diariaDto';

describe('verificarDestino', () => {
  it('deve retornar DF_MANaus para o Distrito Federal', () => {
    expect(verificarDestino(53)).toBe(Destino.DF_MANaus);
    expect(verificarDestino(1302603)).toBe(Destino.DF_MANaus);
  });

  it('deve retornar SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA para municípios específicos de 80%', () => {
    expect(verificarDestino(3550308)).toBe(Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA);
    expect(verificarDestino(3304557)).toBe(Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA);  
  });

  it('deve retornar DEMAIS_CAPITAIS para as demais capitais', () => {
    expect(verificarDestino(2800308)).toBe(Destino.DEMAIS_CAPITAIS);
    expect(verificarDestino(1400100)).toBe(Destino.DEMAIS_CAPITAIS);  
  });

  it('deve retornar MAIS_DE_200K_HABITANTES_DISTANCIA_70KM para municípios com população >= 200.000', () => {
    expect(verificarDestino(3518800)).toBe(Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM);
    expect(verificarDestino(3509502)).toBe(Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM);    
  });

  it('deve retornar null se o código do município não estiver em nenhuma lista', () => {
    expect(verificarDestino(9999999)).toBeNull();
    
  });
});
