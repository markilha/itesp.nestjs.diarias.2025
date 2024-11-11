import { RequisDto, ReturnRequisicaoDto } from '../requisicao.dto';

export const mockRequisicaoDto = [
  {
    reqIdCodigo: 139836,
    chapa: '000081',
    reqDtReq: '10/07/2012 09:01:53',
    reqDtSaida: '2012-08-02T03:00:00.000Z',
    reqHSaida: '07:00:00',
    reqDtRetorno: '10/07/2012 09:01:53',
    reqMotivo: 'Levantamento da agrovila da Área V.',
    reqHRet: '17:00:00',
    reqKm: 150,
    reqStatus: 'FINALIZADA',
    reqIntegral: 0,
    reqParcial: 1,
    reqEspecial: 0,
    reqPacote: 'S',
    reqGovernador: 'N',
    desLocal: 'Fazenda Pirituba Área V.',
    desMunIdCodigo: 6535,
    diariaIntegral: 0,
    diariaParcial: 25.82,
    diariaBase: 129.08,
    saqueMes: 0,
    valorSolicitado: 25.82,
    salario50Porcento: 634,
    saldoDisponivel: 608.18,
    regDescricao: 'SUDOESTE - SOROCABA',
    traDescricao: 'VEICULO',
    diariaParcPorc: 20,
    vlDiaria: 129.08,
    ITI_DTSAIDA: '2012-08-02',
    ITI_HSAIDA: '08:02:00',
    ITI_DTCHEGADA: '2012-08-02',
    ITI_HCHEGADA: '16:40:00',
    diariaIntegralChegada: 1,
    diairaParcialChegada: 20,
  },
];

export const mockAprovadas = [
  {
    chapa: '000081',
    reqIdCodigo: 101896,
    reqStatus: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
  },
  {
    chapa: '000081',
    reqIdCodigo: 121514,
    reqStatus: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
  },
];

export const mockReqMes = [
  
    {
      requisicao_REQ_ID_CODIGO: 315184,
      requisicao_REG_ID_CODIGO: 4,
      requisicao_COD_MUNICIP: 351020,
      requisicao_REQ_DTREQ: '29/11/2023 07:57:54',
      requisicao_REQ_DTSAIDA: '2023-12-04T03:00:00.000Z',
      requisicao_REQ_MOTORISTA: 'N',
      requisicao_REQ_HSAIDA: '08:00:00',
      requisicao_REQ_HRET: '17:00:00',
      requisicao_REQ_MOTIVO: 'Levantamento topográfico para fins de titulação conforme determinação de Gerência de Arrecadação e Projetos e Diretoria Executiva',
      requisicao_REQ_KM: 300,
      requisicao_REQ_STATUS: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
      requisicao_REQ_DIARIA: '0',
      requisicao_REQ_INTEGRAL: 4,
      requisicao_REQ_PARCIAL: 20,
      requisicao_REQ_ESPECIAL: 0,
      requisicao_TRA_ID_CODIGO: 1,
      requisicao_NME_MUNIC: 'CAPAO BONITO',
      requisicao_REG_DESCRICAO: 'SUDOESTE - SOROCABA',
      requisicao_TRA_DESCRICAO: 'VEICULO',
      requisicao_CHAPA: '000081',
      requisicao_REQ_PACOTE: '0',
      requisicao_REQ_GOVERNADOR: 'N'
    }
 
];
export const mockReqMesResult = [
  {
    chapa: '000081',
    reqIdCodigo: 315184,
    reqStatus: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
    reqDtReq: '29/11/2023 07:57:54',
  },
];


export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue(mockReqMes),
};
