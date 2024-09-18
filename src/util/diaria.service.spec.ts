import { DiariaService } from './diaria.service';
import { Destino, enumCargo } from './diariaDto';

const UFESP = 35.36;

describe('CARGO DIREÇÃO OU SUPERIOR', () => {
  let service: DiariaService;
  beforeEach(() => {
    service = new DiariaService();
  });
  describe('Destino DF_MANaus', () => {    
    describe('parcial 20%', () => {
      it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
        const cargo = enumCargo.DIRECAO;
        const destino = Destino.DF_MANaus;
        const req_pacote = 0;
        const req_integral = 1;
        const req_parcial = 1;
        const horaRetorno = '14:00';
        const resultado = service.calcularDiaria(
          UFESP,
          cargo,
          destino,
          req_pacote,
          req_integral,
          req_parcial,
          horaRetorno,
        );

        expect(resultado.diariaIntegral).toBe(636.48); 
        expect(resultado.diariaParcial40).toBe(0); 
        expect(resultado.diariaParcial20).toBe(127.3); 
      });
    });
    describe('parcial 40%', () => {
        it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
          const cargo = enumCargo.DIRECAO;
          const destino = Destino.DF_MANaus;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '19:01';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
          expect(resultado.diariaIntegral).toBe(636.48); 
          expect(resultado.diariaParcial40).toBe(254.59); 
          expect(resultado.diariaParcial20).toBe(0);
        });
      });
  });
  describe('Capitais', () => {    
    describe('parcial 20%', () => {
      it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
        const cargo = enumCargo.DIRECAO;
        const destino = Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA;
        const req_pacote = 0;
        const req_integral = 1;
        const req_parcial = 1;
        const horaRetorno = '14:00';
        const resultado = service.calcularDiaria(
          UFESP,
          cargo,
          destino,
          req_pacote,
          req_integral,
          req_parcial,
          horaRetorno,
        );

        expect(resultado.diariaIntegral).toBe(572.83);
        expect(resultado.diariaParcial40).toBe(0); 
        expect(resultado.diariaParcial20).toBe(114.57); 
      });
    });
    describe('parcial 40%', () => {
        it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
          const cargo = enumCargo.DIRECAO;
          const destino = Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '19:01';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
          expect(resultado.diariaIntegral).toBe(572.83);
          expect(resultado.diariaParcial40).toBe(229.13); 
          expect(resultado.diariaParcial20).toBe(0);
        });
      });
  });
  describe('Demais Capitais', () => {    
    describe('parcial 20%', () => {
      it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
        const cargo = enumCargo.DIRECAO;
        const destino = Destino.DEMAIS_CAPITAIS;
        const req_pacote = 0;
        const req_integral = 1;
        const req_parcial = 1;
        const horaRetorno = '14:00';
        const resultado = service.calcularDiaria(
          UFESP,
          cargo,
          destino,
          req_pacote,
          req_integral,
          req_parcial,
          horaRetorno,
        );

        expect(resultado.diariaIntegral).toBe(541.01);
        expect(resultado.diariaParcial40).toBe(0); 
        expect(resultado.diariaParcial20).toBe(108.20); 
      });
    });
    describe('parcial 40%', () => {
        it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
          const cargo = enumCargo.DIRECAO;
          const destino = Destino.DEMAIS_CAPITAIS;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '19:01';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
          expect(resultado.diariaIntegral).toBe(541.01);
          expect(resultado.diariaParcial40).toBe(216.40); 
          expect(resultado.diariaParcial20).toBe(0);
        });
      });
  });
  describe('Superior 200.000 hab', () => {    
    describe('parcial 20%', () => {
      it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
        const cargo = enumCargo.DIRECAO;
        const destino = Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM;
        const req_pacote = 0;
        const req_integral = 1;
        const req_parcial = 1;
        const horaRetorno = '14:00';
        const resultado = service.calcularDiaria(
          UFESP,
          cargo,
          destino,
          req_pacote,
          req_integral,
          req_parcial,
          horaRetorno,
        );

        expect(resultado.diariaIntegral).toBe(477.36);
        expect(resultado.diariaParcial40).toBe(0);
        expect(resultado.diariaParcial20).toBe(95.47);
      });
    });
    describe('parcial 40%', () => {
        it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
          const cargo = enumCargo.DIRECAO;
          const destino = Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '19:01';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
          expect(resultado.diariaIntegral).toBe(477.36);
          expect(resultado.diariaParcial40).toBe(190.94); 
          expect(resultado.diariaParcial20).toBe(0);
        });
      });
  });
  describe('Outras localidades', () => {    
    describe('parcial 20%', () => {
      it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
        const cargo = enumCargo.DIRECAO;
        const destino = Destino.OUTRAS_LOCALIDADES;
        const req_pacote = 0;
        const req_integral = 1;
        const req_parcial = 1;
        const horaRetorno = '14:00';
        const resultado = service.calcularDiaria(
          UFESP,
          cargo,
          destino,
          req_pacote,
          req_integral,
          req_parcial,
          horaRetorno,
        );

        expect(resultado.diariaIntegral).toBe(318.24);
        expect(resultado.diariaParcial40).toBe(0);
        expect(resultado.diariaParcial20).toBe(63.65);
      });
    });
    describe('parcial 40%', () => {
        it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
          const cargo = enumCargo.DIRECAO;
          const destino = Destino.OUTRAS_LOCALIDADES;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '19:01';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
          expect(resultado.diariaIntegral).toBe(318.24);
          expect(resultado.diariaParcial40).toBe(127.30); 
          expect(resultado.diariaParcial20).toBe(0);
        });
      });
  }); 
});

describe('DEMAIS CARGOS', () => {
    let service: DiariaService;
    beforeEach(() => {
      service = new DiariaService();
    });
    describe('Destino DF_MANaus', () => {    
      describe('parcial 20%', () => {
        it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
          const cargo = enumCargo.DEMAIS;
          const destino = Destino.DF_MANaus;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '14:00';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
  
          expect(resultado.diariaIntegral).toBe(495.04); 
          expect(resultado.diariaParcial40).toBe(0); // 636.48 * 0.4
          expect(resultado.diariaParcial20).toBe(99.01); // 636.48 * 0.2
        });
      });
      describe('parcial 40%', () => {
          it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
            const cargo = enumCargo.DEMAIS;
            const destino = Destino.DF_MANaus;
            const req_pacote = 0;
            const req_integral = 1;
            const req_parcial = 1;
            const horaRetorno = '19:01';
            const resultado = service.calcularDiaria(
              UFESP,
              cargo,
              destino,
              req_pacote,
              req_integral,
              req_parcial,
              horaRetorno,
            );
            expect(resultado.diariaIntegral).toBe(495.04); 
            expect(resultado.diariaParcial40).toBe(198.02); 
            expect(resultado.diariaParcial20).toBe(0);
          });
        });
    });
    describe('Capitais', () => {    
      describe('parcial 20%', () => {
        it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
            const cargo = enumCargo.DEMAIS;
          const destino = Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '14:00';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
  
          expect(resultado.diariaIntegral).toBe(445.54);
          expect(resultado.diariaParcial40).toBe(0); // 636.48 * 0.4
          expect(resultado.diariaParcial20).toBe(89.11); // 636.48 * 0.2
        });
      });
      describe('parcial 40%', () => {
          it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
            const cargo = enumCargo.DEMAIS;
            const destino = Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA;
            const req_pacote = 0;
            const req_integral = 1;
            const req_parcial = 1;
            const horaRetorno = '19:01';
            const resultado = service.calcularDiaria(
              UFESP,
              cargo,
              destino,
              req_pacote,
              req_integral,
              req_parcial,
              horaRetorno,
            );
            expect(resultado.diariaIntegral).toBe(445.54);
            expect(resultado.diariaParcial40).toBe(178.21); 
            expect(resultado.diariaParcial20).toBe(0);
          });
        });
    });

    describe('Demais Capitais', () => {    
      describe('parcial 20%', () => {
        it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
            const cargo = enumCargo.DEMAIS;
          const destino = Destino.DEMAIS_CAPITAIS;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '14:00';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
  
          expect(resultado.diariaIntegral).toBe(420.78);
          expect(resultado.diariaParcial40).toBe(0); 
          expect(resultado.diariaParcial20).toBe(84.16); 
        });
      });
      describe('parcial 40%', () => {
          it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
            const cargo = enumCargo.DEMAIS;
            const destino = Destino.DEMAIS_CAPITAIS;
            const req_pacote = 0;
            const req_integral = 1;
            const req_parcial = 1;
            const horaRetorno = '19:01';
            const resultado = service.calcularDiaria(
              UFESP,
              cargo,
              destino,
              req_pacote,
              req_integral,
              req_parcial,
              horaRetorno,
            );
            expect(resultado.diariaIntegral).toBe(420.78);
            expect(resultado.diariaParcial40).toBe(168.31); 
            expect(resultado.diariaParcial20).toBe(0);
          });
        });
    });

    describe('Superior 200.000 hab', () => {    
      describe('parcial 20%', () => {
        it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
            const cargo = enumCargo.DEMAIS;
          const destino = Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '14:00';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
  
          expect(resultado.diariaIntegral).toBe(371.28);
          expect(resultado.diariaParcial40).toBe(0);
          expect(resultado.diariaParcial20).toBe(74.26);
        });
      });
      describe('parcial 40%', () => {
          it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
            const cargo = enumCargo.DEMAIS;
            const destino = Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM;
            const req_pacote = 0;
            const req_integral = 1;
            const req_parcial = 1;
            const horaRetorno = '19:01';
            const resultado = service.calcularDiaria(
              UFESP,
              cargo,
              destino,
              req_pacote,
              req_integral,
              req_parcial,
              horaRetorno,
            );
            expect(resultado.diariaIntegral).toBe(371.28);
            expect(resultado.diariaParcial40).toBe(148.51); 
            expect(resultado.diariaParcial20).toBe(0);
          });
        });
    });

    describe('Outras localidades', () => {    
      describe('parcial 20%', () => {
        it('deve calcular a diária parcialmente com 20% (hora de chegada > 13 horas)', () => {
            const cargo = enumCargo.DEMAIS;
          const destino = Destino.OUTRAS_LOCALIDADES;
          const req_pacote = 0;
          const req_integral = 1;
          const req_parcial = 1;
          const horaRetorno = '14:00';
          const resultado = service.calcularDiaria(
            UFESP,
            cargo,
            destino,
            req_pacote,
            req_integral,
            req_parcial,
            horaRetorno,
          );
  
          expect(resultado.diariaIntegral).toBe(247.52);
          expect(resultado.diariaParcial40).toBe(0);
          expect(resultado.diariaParcial20).toBe(49.50);
        });
      });
      describe('parcial 40%', () => {
          it('deve calcular a diária parcialmente com 40% (hora de chegada  > 19 horas)', () => {
            const cargo = enumCargo.DEMAIS;
            const destino = Destino.OUTRAS_LOCALIDADES;
            const req_pacote = 0;
            const req_integral = 1;
            const req_parcial = 1;
            const horaRetorno = '19:01';
            const resultado = service.calcularDiaria(
              UFESP,
              cargo,
              destino,
              req_pacote,
              req_integral,
              req_parcial,
              horaRetorno,
            );
            expect(resultado.diariaIntegral).toBe(247.52);
            expect(resultado.diariaParcial40).toBe(99.01); 
            expect(resultado.diariaParcial20).toBe(0);
          });
        });
    }); 
  });
