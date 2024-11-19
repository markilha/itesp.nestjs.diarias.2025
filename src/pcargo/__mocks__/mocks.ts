import { FindAllParams, PcargoDto } from "../pcargoDto";

export const mockParams: FindAllParams = { codigo: '123', page: 1, limit: 10 };
export const mockResult: PcargoDto[] = [{ codigo: '123', nome: 'Marco' }];