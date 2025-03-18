export function RetonaPrestacaoStatus(
  sqeefetivo: string,
  sqetiposaque: string,
  praativo: string,
  sqedtprest: string,
  sqevlprest: number,
) {
  //  praativo != 'N' &&
  const STATUS =
    ['P', 'S', 'E'].includes(sqeefetivo) &&
    sqetiposaque === 'N' &&
    (sqedtprest === null || sqevlprest === 0 || sqedtprest === '')
      ? 'Pendente'
      : sqedtprest === null || sqevlprest === 0 || sqedtprest === ''
        ? null
        : 'Realizada';

  return STATUS;
}
//SQE_TIPOSAQUE: 'N', SQE_EFETIVO: 'S', TIPO: 'Viagem', EFETUADO: 'Sim  - Pagamento Efetuado'
//SQE_TIPOSAQUE: 'N',  SQE_EFETIVO: 'P',  TIPO: 'Viagem-Reembolso',  EFETUADO: 'Sim - Pagamento Efetuado'
//SQE_TIPOSAQUE: 'N',SQE_EFETIVO: 'E',TIPO: 'Viagem - Complemento', EFETUADO: 'Sim - Pagamento Efetuado',

export function RetornaSaquePendentes(sqeefetivo: string, sqetiposaque: string, praativo: string) {
  //&& praativo != 'N'
  const STATUS =
    ['A', 'C', 'D', 'T'].includes(sqeefetivo) && sqetiposaque === 'N' ? 'Pendente' : 'Realizada';

  return STATUS;
}
//SQE_TIPOSAQUE: 'N', SQE_EFETIVO: 'A', TIPO: 'Viagem', EFETUADO: 'Não - Aguardar Pagamento'
//SQE_TIPOSAQUE: 'N', SQE_EFETIVO: 'C',TIPO: 'Viagem-Complemento', EFETUADO: 'Não - Aguardar Pagamento'
//SQE_TIPOSAQUE: 'N', SQE_EFETIVO: 'D',TIPO: 'Viagem-c/Lanc. Documentos',EFETUADO: 'Não - Aguardando documentos/relatório para efetuar Pagamento'
//SQE_TIPOSAQUE: 'N', SQE_EFETIVO: 'T',TIPO: 'Viagem',EFETUADO: 'Aguardando Transferência para saque',
