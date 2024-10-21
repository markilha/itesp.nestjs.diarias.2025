import { Requisicao_Entity } from "src/database/db_mysql/entities/requisicao_.entity";
import { UsuReqEntity } from "src/database/db_mysql/entities/usureq.entity";


export class UsureqDto {
  iteidcodigo: number; // Código do item
  sqeidcodigo: number; // Código de saque
  reqIdCodigo: number; // Código da requisição
  nome: string; // Nome do funcionário
  chapa: string; // Identificação do funcionário (chapa)
  reqDtReq: string; // Data da requisição
  reqDtSaida: string; // Data de saída
  reqHSaida: string; // Hora de saída
  reqDtRetorno: string; // Data de retorno
  reqMotivo: string; // Motivo da requisição
  reqHRet: string; // Hora de retorno
  reqKm: number; // Quilometragem
  reqStatus: string; // Status da requisição
  reqIntegral: number; // Número de diárias integrais
  reqParcial: number; // Número de diárias parciais
  reqEspecial: number; // Indica se é uma requisição especial
  reqPacote: string; // Indica se é um pacote
  reqGovernador: string; // Indica se é governador
  desLocal: string | null; // Descrição do local
  desMunIdCodigo: number; // Código do município
  desMunNme: string; // Nome do município
  diariaIntegral: number; // Valor da diária integral
  diariaParcial: number; // Valor da diária parcial
  diariaBase: number; // Valor base da diária
  saqueMes: number; // Valor de saque no mês
  valorSolicitado: number; // Valor solicitado
  salario50Porcento: number; // 50% do salário
  saldoDisponivel: number; // Saldo disponível
  regDescricao: string; // Descrição da região
  traDescricao: string; // Descrição do transporte
  diariaParcPorc: number; // Porcentagem da diária parcial
  vlDiaria: number; // Valor da diária
  requisicao?: Requisicao_Entity;

  constructor(item: any) {

    this.sqeidcodigo = item.sqeidcodigo;
    this.iteidcodigo = item.iteidcodigo
    this.reqIdCodigo = item.reqIdCodigo;
    this.chapa = item.chapa;
    this.nome = item.nome;
   
    this.reqDtSaida = item.reqDtSaida;
    this.reqHSaida = item.reqHSaida;
    this.reqDtRetorno = item.reqDtRetorno;
    this.reqMotivo = item.reqMotivo;
    this.reqHRet = item.reqHRet;
    this.reqKm = item.reqKm;
    this.reqStatus = item.reqStatus;
    this.reqIntegral = Number(item.reqIntegral) || 0;
    this.reqParcial = (Number(item.reqParcial) > 0 ? 1 : 0) || 0;
    this.reqEspecial = Number(item.reqEspecial) || 0;
    this.reqPacote = Number(item.reqPacote) === 0 ? 'S' : 'N';
    this.reqGovernador = item.reqGovernador;
    this.traDescricao = item.traDescricao;
    this.desLocal = item.desLocal;
    this.desMunNme = item.desMunNme;
    this.desMunIdCodigo = item.desMunIdCodigo;
    this.regDescricao = item.regDescricao;
    this.diariaIntegral = item.diariaIntegral;
    this.diariaParcial = item.diariaParcial;
    this.diariaBase = item.diariaBase;
    this.saqueMes = item.saqueMes;
    this.valorSolicitado = item.valorSolicitado;
    this.salario50Porcento = item.salario50Porcento;
    this.saldoDisponivel = item.saldoDisponivel;
    this.diariaParcPorc = item.diariaParcPorc;
    this.vlDiaria = item.vlDiaria;    
    this.requisicao = item.requisicao;
  }
}

export class RequisicaoDto {
  CHAPA: string;                 // Código do usuário
  REQ_ID_CODIGO: number;         // Código da requisição
  REQ_DTSAIDA: string;           // Data de saída
  REQ_HSAIDA: string;            // Hora de saída
  REQ_DTRET: string;             // Data de retorno
  REQ_DTREQ: string;             // Data da requisição
  REQ_MOTIVO: string;            // Motivo da requisição
  REQ_HRET: string;              // Hora de retorno
  REQ_KM: number;                // Quilometragem
  REQ_STATUS: string;            // Status da requisição
  REQ_DIARIA: number;            // Valor da diária
  REQ_INTEGRAL: number;          // Número de diárias integrais
  REQ_PARCIAL: number;           // Número de diárias parciais
  REQ_ESPECIAL: number;          // Requisição especial (0 ou 1)
  REQ_PACOTE: number;            // Pacote (S ou N)
  REQ_GOVERNADOR: string;        // Governador (S ou N)
  TRA_ID_CODIGO: number;         // Código de transporte
  REG_DESCRICAO: string;         // Descrição da região
  TRA_DESCRICAO: string;         // Descrição do transporte
  DES_LOCAL: string | null;      // Local de destino (pode ser nulo)
  MUN_CIDADE: string;            // Cidade do município
  MUN_ID_CODIGO: number;         // Código do município
  nome: string;                  // Nome da pessoa
  SQE_ID_CODIGO: number;         // Código de saque (máximo)
  ITE_ID_CODIGO: number;         // Código do item (máximo) 
  requisicao?: Requisicao_Entity;
}


export interface FindAllParams {
  SQE_ID_CODIGO: number;
  REQ_ID_CODIGO: number;
  CHAPA: string;
  USU_MOV: string;
  page: number;
  limit: number;
}
