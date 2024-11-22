import { ApiProperty } from '@nestjs/swagger';
import { SaqueMesEntity } from 'src/database/db_mysql/entities/saqueMes.entity';

export class SaqueMesDto {
  CHAPA: string;
  TDE_ID_CODIGO: number;
  SQE_TIPOSAQUE: string;
  messaque: string;
  totSaque: number;
  TotalSaqueMes: number;

  constructor(entity: SaqueMesEntity, totalSaqueMes: number) {
    this.CHAPA = entity.CHAPA;
    this.TDE_ID_CODIGO = entity.TDE_ID_CODIGO;
    this.SQE_TIPOSAQUE = entity.SQE_TIPOSAQUE;
    this.messaque = entity.messaque;
    this.totSaque = entity.TotSaque;
    this.TotalSaqueMes = totalSaqueMes;
  }
}

export class returnDevolucaoDto {
  CHAPA: string;
  TDE_ID_CODIGO: number;
  MESDEV: string;
  VLDEVOLUCAO: number;
}

export class returnTransferenciaDto {
  @ApiProperty()
  MESPED: string;
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  VLTOTAL: number;
}

// SaqueEfetMes.dto.ts
export class SaqueEfetMesDto {
  CHAPA: string; // Chapa do funcionário
  NOME: string; // Nome do funcionário
  DESCRICAO: string; // Descrição da seção
  FUNCAO: string; // Função do funcionário
  MESSAQUE: string; // Mês do saque
  totSaque: number; // Total de saques
  totSaqueEstCanc: number; // Total de saques cancelados
  mesDev: string; // Mês de devolução
  vlDevolucao: number; // Valor da devolução
  salario: number; // Salário do funcionário
}

export class FindAllParams {
  @ApiProperty({ required: false })
  chapa?: string;
  @ApiProperty({ required: false })
  messaque?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  orderBy?: string;
  @ApiProperty({ required: false })
  orderDirection?: string;
}
