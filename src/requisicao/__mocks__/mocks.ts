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
      reqIdCodigo: 101896,
      reqStatus: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
      chapa: '000081',
      reqDtReq: '07/11/2024 09:00:51'
    },
    {
      reqIdCodigo: 121514,
      reqStatus: 'AUTORIZADA PELO DIRETOR EXECUTIVO',
      chapa: '000081',
      reqDtReq: '08/11/2024 09:00:51'
    }
  ];


  export const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(mockReqMes), 
  };


