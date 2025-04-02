import { UfespDto } from '../dto/ufesp.dto';

export const mocksUfesp = {
  ufeIdCodigo: 20,
  tdeIdCodigo: 7,
  ufeValor: 35.36,
  ufeDtInicio: '2024-01-01',
  ufeDtFinal: '2024-12-31',
};

export const ufespData: UfespDto = {
  ufeIdCodigo: 1,
  ufeDtInicio: new Date(),
  ufeDtFinal: new Date(),
};

export const updateData: UfespDto = {
  ufeIdCodigo: 20,
  tdeIdCodigo: 7,
  ufeValor: 35.36,
  ufeDtInicio: new Date('2024-01-01'),
  ufeDtFinal: new Date('2024-12-31'),
};
