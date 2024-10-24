export function RetonaStatus(
  sqeefetivo: string,
  sqetiposaque: string,
  praativo: string,
  sqedtprest: string,
  sqevlprest: number,
) {
  const STATUS =
    ['S', 'C', 'R', 'E'].includes(sqeefetivo) &&
    sqetiposaque === 'N' &&
    praativo != 'N' &&
    (sqedtprest === null || sqevlprest === 0)
      ? 'Pendente'
      : 'Realizada';

  return STATUS;
}
