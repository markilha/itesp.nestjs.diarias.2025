import { SaqueTipoN } from '../enums/sqeefetivo';

export function RetonaPrestacaoStatus(
  sqeefetivo: string,
  sqetiposaque: string,
  praativo: string,
  sqedtprest: string,
  sqevlprest: number,
) {
  const STATUS =
    [
      SaqueTipoN['35-sim-Viagem'],
      SaqueTipoN['34-sim-Viagem-Reembolso'],
      SaqueTipoN['37-sim-Viagem-Complemento'],
    ].includes(sqeefetivo as SaqueTipoN) &&
    praativo != 'N' &&
    sqetiposaque === 'N' &&
    (sqedtprest === null || sqevlprest === 0 || sqedtprest === '')
      ? 'Pendente'
      : sqedtprest === null || sqevlprest === 0 || sqedtprest === ''
        ? null
        : 'Realizada';

  return STATUS;
}
export function RetornaSaquePendentes(sqeefetivo: string, sqetiposaque: string, praativo: string) {
  const STATUS =
    [
      SaqueTipoN['25-não-Viagem'],
      SaqueTipoN['28-não-Viagem-Complemento'],
      SaqueTipoN['32-não-Viagem-c/Lanc-Documentos'],
      SaqueTipoN['48-aguardando-Viagem'],
    ].includes(sqeefetivo as SaqueTipoN) &&
    sqetiposaque === 'N' &&
    praativo != 'N'
      ? 'Pendente'
      : 'Realizada';

  return STATUS;
}
