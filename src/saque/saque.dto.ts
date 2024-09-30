export class SaqueDto {
    sqeIdCodigo: number;
    sqeDtSaque: string | null;
    sqeVlPrest: number | null;
    sqeDtPrest: string | null;
    sqeVlSaque: number | null;
    sqeEfetivo: string | null;
    sqeDtPedido: string | null;
  
    constructor(
      sqeIdCodigo: number,
      sqeDtSaque: string | null,
      sqeVlPrest: number | null,
      sqeDtPrest: string | null,
      sqeVlSaque: number | null,
      sqeEfetivo: string | null,
      sqeDtPedido: string | null
    ) {
      this.sqeIdCodigo = sqeIdCodigo;
      this.sqeDtSaque = sqeDtSaque;
      this.sqeVlPrest = sqeVlPrest;
      this.sqeDtPrest = sqeDtPrest;
      this.sqeVlSaque = sqeVlSaque;
      this.sqeEfetivo = sqeEfetivo;
      this.sqeDtPedido = sqeDtPedido;
    }
  }

  export interface FindAllParams {
    sqeIdCodigo?: number;
    page?: number;
    limit?: number;
  }
  