import { DiariaService } from './diaria.service';
import { Destino, enumCargo } from './diariaDto';


describe('DiariaService', () => {
  let service: DiariaService;

  beforeEach(() => {
    service = new DiariaService();
  });

  it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
    const UFESP = 35.36;
    const cargo = enumCargo.DIRECAO;
    const destino = Destino.DF_MANaus;
    const req_pacote = 0;
    const req_integral = 1;
    const req_parcial = 1;
    const horaRetorno = '14:00';

    const resultado = service.calcularDiaria(UFESP, cargo, destino, req_pacote, req_integral, req_parcial, horaRetorno);

  
    expect(resultado.diariaIntegral).toBe(636.48); // 1 * 636.48
    expect(resultado.diariaParcial40).toBe(0); // 636.48 * 0.4
    expect(resultado.diariaParcial20).toBe(127.30);// 636.48 * 0.2
  });

  it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
    const UFESP = 35.36;
    const cargo = enumCargo.DIRECAO;
    const destino = Destino.DF_MANaus;
    const req_pacote = 0;
    const req_integral = 1;
    const req_parcial = 1;
    const horaRetorno = '19:01';

    const resultado = service.calcularDiaria(UFESP, cargo, destino, req_pacote, req_integral, req_parcial, horaRetorno);

   
    expect(resultado.diariaIntegral).toBe(636.48); // 1 * 636.48
    expect(resultado.diariaParcial40).toBe(254.59); // 636.48 * 0.4
    expect(resultado.diariaParcial20).toBe(0);
  });

//   it('deve calcular a diária parcialmente com 20% (deslocamento entre 6 e 12 horas)', () => {
//     const UFESP = 35.36;
//     const cargo = enumCargo.DIRECAO;
//     const destino = Destino.OUTRAS_LOCALIDADES;
//     const req_pacote = 0;
//     const req_integral = 0;
//     const req_parcial = 1;
//     const horaRetorno = '08:00';

//     const resultado = service.calcularDiaria(UFESP, cargo, destino, req_pacote, req_integral, req_parcial, horaRetorno);

//     expect(resultado.diariaBase).toBe(270); // 9 * 30 (não ajustado por destino)
//     expect(resultado.diariaIntegral).toBe(0);
//     expect(resultado.diariaParcial40).toBe(0);
//     expect(resultado.diariaParcial20).toBe(54); // 270 * 0.2
//   });

//   it('deve aplicar desconto de 50% quando req_pacote for 1', () => {
//     const UFESP = 35.36;
//     const cargo = enumCargo.DIRECAO;
//     const destino = Destino.DF_MANaus;
//     const req_pacote = 1;
//     const req_integral = 1;
//     const req_parcial = 0;
//     const horaRetorno = '13:00';

//     const resultado = service.calcularDiaria(UFESP, cargo, destino, req_pacote, req_integral, req_parcial, horaRetorno);

//     expect(resultado.diariaBase).toBe(270); // (9 * 30 * 2) * 0.5
//     expect(resultado.diariaIntegral).toBe(270); // 1 * 270
//     expect(resultado.diariaParcial40).toBe(0);
//     expect(resultado.diariaParcial20).toBe(0);
//   });
});
