import { DataUtils } from './DataUtils';

describe('DiariaUtils', () => {
  describe('arredondar', () => {
    it('deve arredondar corretamente um valor decimal', () => {
      const valor = DataUtils.arredondar(2.34567);
      expect(valor).toBe(2.35);
    });

    it('deve lançar um erro se o valor não puder ser arredondado', () => {
      expect(() => DataUtils.arredondar(NaN)).toThrow('Valor inválido para arredondar');
    });
  });

  describe('calcularHorasDeslocamento', () => {
    it('deve calcular corretamente as horas de deslocamento', () => {
      const horas = DataUtils.calcularHorasDeslocamento(
        '05/09/2024',
        '08:00',
        '06/09/2024',
        '17:00',
      );
      expect(horas).toBe(33); // 33 horas de diferença
    });

    it('deve lançar um erro se houver um problema no cálculo das horas de deslocamento', () => {
      expect(() =>
        DataUtils.calcularHorasDeslocamento('invalid', '08:00', '06/09/2024', '17:00'),
      ).toThrow('Data ou hora inválida');
    });
  });
});
