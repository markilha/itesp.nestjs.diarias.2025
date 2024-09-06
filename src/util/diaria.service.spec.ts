import { Test, TestingModule } from '@nestjs/testing';
import { DiariaService } from './diaria.service';
import { Destino, enumCargo } from './diariaDto';

describe('DiariaService', () => {
  let service: DiariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiariaService],
    }).compile();

    service = module.get<DiariaService>(DiariaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('----------DEMAIS CARGO-----------', () => {
    describe('---DF/MANAUS', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.DF_MANaus, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('594.05');
      });
      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.DF_MANaus, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('346.53');
      });
    });

    describe('---SP', () => {
      it('Sem Alojamento', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('534.65'); // Valor ajustado conforme o teste
      });

      it('Com Alojamento', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('311.88'); // Valor ajustado conforme o teste
      });
    });

    describe('---DEMAIS CAPITAIS', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.DEMAIS_CAPITAIS, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('504.94');
      });
      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          'Demais cargo', //carco
          Destino.DEMAIS_CAPITAIS, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('294.55');
      });
    });

    describe('---+ DE 200 HABITANTES ', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('445.54');
      });
      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('259.90');
      });
    });

    describe('---DEMAIS CAPITAIS ', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.DEMAIS_CAPITAIS, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('504.94');
      });
      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.DEMAIS_CAPITAIS, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('294.55');
      });
    });

    describe('---OUTRAS LOCALIDADES ', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.OUTRAS_LOCALIDADES, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('297.02');
      });

      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DEMAIS, //carco
          Destino.OUTRAS_LOCALIDADES, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('173.26');
      });
    });
  });

  describe('-----------DIREÇÃO DE NÍVEL SUPERIOR----------------', () => {
    describe('---DF/MANAUS', () => {
      it('Sem alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DIRECAO, //carco
          Destino.DF_MANaus, //destino
          10, //deslocamento
          true, //pernoite
          false, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('763.78');
      });
      it('Com alojamento ', () => {
        const result = service.calcularDiaria(
          enumCargo.DIRECAO, //carco
          Destino.DF_MANaus, //destino
          10, //deslocamento
          true, //pernoite
          true, //alojamento
          '05/09/2024', //dataSaida
          '06/09/2024', //dataSaida
          '17:00', //horaRetorno
        );

        expect(result).toBe('445.54');
      });

      describe('---SP', () => {
        it('Sem Alojamento', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA, //destino
            10, //deslocamento
            true, //pernoite
            false, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );
          expect(result).toBe('687.40'); // Valor ajustado conforme o teste
        });
        it('Com Alojamento', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.SAO_PAULO_RIO_JANEIRO_BH_POA_SALVADOR_RECIFE_FORTALEZA, //destino
            10, //deslocamento
            true, //pernoite
            true, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );
          expect(result).toBe('400.99'); // Valor ajustado conforme o teste
        });
      });

      describe('---DEMAIS CAPITAIS', () => {
        it('Sem alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.DEMAIS_CAPITAIS, //destino
            10, //deslocamento
            true, //pernoite
            false, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('649.21');
        });
        it('Com alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.DEMAIS_CAPITAIS, //destino
            10, //deslocamento
            true, //pernoite
            true, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('378.70');
        });
      });

      describe('---+ DE 200 HABITANTES ', () => {
        it('Sem alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM, //destino
            10, //deslocamento
            true, //pernoite
            false, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('572.83');
        });
        it('Com alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM, //destino
            10, //deslocamento
            true, //pernoite
            true, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('334.15');
        });
      });

      describe('---DEMAIS CAPITAIS ', () => {
        it('Sem alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.DEMAIS_CAPITAIS, //destino
            10, //deslocamento
            true, //pernoite
            false, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('649.21');
        });
        it('Com alojamento ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.DEMAIS_CAPITAIS, //destino
            10, //deslocamento
            true, //pernoite
            true, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('378.70');
        });
      });

      describe('---OUTRAS LOCALIDADES ', () => {
        it('Sem alojamento (20%) ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.OUTRAS_LOCALIDADES, //destino
            10, //deslocamento
            true, //pernoite
            false, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );

          expect(result).toBe('381.89');
        });

        it('Sem alojamento (40%) ', () => {
            const result = service.calcularDiaria(
              enumCargo.DIRECAO, //carco
              Destino.OUTRAS_LOCALIDADES, //destino
              10, //deslocamento
              true, //pernoite
              false, //alojamento
              '05/09/2024', //dataSaida
              '06/09/2024', //dataSaida
              '19:00', //horaRetorno
            );
  
            expect(result).toBe('445.54');
          });       
  

        it('Com alojamento (20%) ', () => {
          const result = service.calcularDiaria(
            enumCargo.DIRECAO, //carco
            Destino.OUTRAS_LOCALIDADES, //destino
            10, //deslocamento
            true, //pernoite
            true, //alojamento
            '05/09/2024', //dataSaida
            '06/09/2024', //dataSaida
            '17:00', //horaRetorno
          );
          expect(result).toBe('222.77');
        });
        
        it('Com alojamento (40%) ', () => {
            const result = service.calcularDiaria(
              enumCargo.DIRECAO, //carco
              Destino.OUTRAS_LOCALIDADES, //destino
              10, //deslocamento
              true, //pernoite
              true, //alojamento
              '05/09/2024', //dataSaida
              '06/09/2024', //dataSaida
              '19:00', //horaRetorno
            );
            expect(result).toBe('286.42');
          });
      });
    });
  });
});
