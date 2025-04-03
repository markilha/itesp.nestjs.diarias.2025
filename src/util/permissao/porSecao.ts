import { HttpException, HttpStatus } from '@nestjs/common';
import { enumCodSecao, permissaoCargo } from '../enums/cargo';

export function filtrarSetorLike(
  permissao: number,
  codigosecao: string,
  campo: string,
): string | null {
  try {
    //DIRETORIA EXECUTIVA  OU DE - Financeiro
    if (
      permissao === permissaoCargo.DIRETOR_EXECUTIVO ||
      permissao === permissaoCargo.CHEFE_GABINETE ||
      (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
        [enumCodSecao.GABINETE_DIRETORIA_EXECUTIVA, enumCodSecao.DIRETOR_EXECUTIVO].includes(
          codigosecao as enumCodSecao,
        ))
    ) {
      return `${campo} LIKE '1.1.%' OR  ${campo} LIKE '1.6.%'`;
    } else if (
      (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
        ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
          codigosecao,
        )) ||
      permissao === permissaoCargo.DIRETOR_ADJUNTO ||
      permissao === permissaoCargo.ASSISTENTE ||
      ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
        codigosecao,
      )
    ) {
      return `${campo} != '${enumCodSecao.DIRETOR_EXECUTIVO}' and  ${campo} LIKE '${codigosecao.substring(0, 5)}%'`;
    } else if (
      permissao === permissaoCargo.GERENTE ||
      permissao === permissaoCargo.RESP_TEC_TRANSPORTE ||
      permissao === permissaoCargo.RESP_TECNICO ||
      permissao === permissaoCargo.ASSESSORIA_OUVIDORIA
    ) {
      return `${campo} LIKE :SETOR`;
    } else if (permissao === permissaoCargo.GTCAMPO) {
      return `${campo} IN (SELECT e.codsecao FROM rm.psubstchefe e WHERE e.chapasubst = :chapalogado AND e.datafim >= SYSDATE)`;
    }
    return null;
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
