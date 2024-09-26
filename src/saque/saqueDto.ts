import { SaqueEntity } from "src/database/db_oracle/entities/saque.entity";

export class SaqueDto {
    sqeIdCodigo: number;
    iteIdCodigo: number;
    rreIdCodigo: number;
    dirIdCodigo: number;
    fpaIdCodigo?: number;
    sqeDtSaque?: string;
    sqeVlPrest?: number;
    sqeDtPrest?: string;
    sqeVlSaque?: number;
    sqeTipoSaque?: string;
    sqeEfetivo?: string;
    sqeDtPedido?: string;
    sqeLote?: number;
    sqeAnoLote?: number;
    stsIdCodigo?: number;
    sqeTerceiro?: string;
    pesIdCodigo?: number;
    pesPessoa?: string;
    sqeUsuario?: string;
    sqeEmpenho?: string;
    sqeListaSiafem?: string;

    constructor(saque: SaqueEntity) {
        this.sqeIdCodigo = saque.sqeIdCodigo;
        this.iteIdCodigo = saque.iteIdCodigo;
        this.rreIdCodigo = saque.rreIdCodigo;
        this.dirIdCodigo = saque.dirIdCodigo;
        this.fpaIdCodigo = saque.fpaIdCodigo;
        this.sqeDtSaque = saque.sqeDtSaque;
        this.sqeVlPrest = saque.sqeVlPrest;
        this.sqeDtPrest = saque.sqeDtPrest;
        this.sqeVlSaque = saque.sqeVlSaque;
        this.sqeTipoSaque = saque.sqeTipoSaque;
        this.sqeEfetivo = saque.sqeEfetivo;
        this.sqeDtPedido = saque.sqeDtPedido;
        this.sqeLote = saque.sqeLote;
        this.sqeAnoLote = saque.sqeAnoLote;
        this.stsIdCodigo = saque.stsIdCodigo;
        this.sqeTerceiro = saque.sqeTerceiro;
        this.pesIdCodigo = saque.pesIdCodigo;
        this.pesPessoa = saque.pesPessoa;
        this.sqeUsuario = saque.sqeUsuario;
        this.sqeEmpenho = saque.sqeEmpenho;
        this.sqeListaSiafem = saque.sqeListaSiafem;      
    }
  }

  export class FindAllParams {
    sqeIdCodigo: number;
    iteIdCodigo: number;
    rreIdCodigo: number;
    dirIdCodigo: number;
    fpaIdCodigo?: number;
    sqeDtSaque?: string;
    sqeVlPrest?: number;
    sqeDtPrest?: string;
    sqeVlSaque?: number;
    sqeTipoSaque?: string;
    sqeEfetivo?: string;
    sqeDtPedido?: string;
    sqeLote?: number;
    sqeAnoLote?: number;
    stsIdCodigo?: number;
    sqeTerceiro?: string;
    pesIdCodigo?: number;
    pesPessoa?: string;
    sqeUsuario?: string;
    sqeEmpenho?: string;
    sqeListaSiafem?: string;
    page?: number;
    limit?: number;
  }
  

  