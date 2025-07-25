export enum LetraSaqueTipoN {
  A = '25-não-Viagem',
  C = '28-não-Viagem-Complemento',
  R = '30-não-Viagem-Reembolso',
  D = '32-não-Viagem-c/Lanc. Documentos',
  P = '34-sim-Viagem-Reembolso',
  S = '35-sim-Viagem',
  E = '37-sim-Viagem - Complemento',
  X = '39-estorno-Viagem',
  G = '41-cancelamento-Viagem',
  Y = '43-cancelado-Viagem',
  T = '48-aguardando-Viagem',
  V = '49-aguardando-Viagem',
  F = '50-aguardando-Viagem',
  B = '51-aguardando-Viagem',
  N = '52-negado-Viagem',
  J = '59-suspenso-Viagem',
  I = '60-suspenso-Viagem',
  H = '61-suspenso-Viagem',
  K = '62-aguardando-Viagem',
  Z = '25-cancelado-Viagem', // último sem id declarado
}
export enum SaqueTipoN {
  '25-não-Viagem' = 'A',
  '28-não-Viagem-Complemento' = 'C',
  '30-não-Viagem-Reembolso' = 'R',
  '32-não-Viagem-c/Lanc-Documentos' = 'D',
  '34-sim-Viagem-Reembolso' = 'P',
  '35-sim-Viagem' = 'S',
  '37-sim-Viagem-Complemento' = 'E',
  '39-estorno-Viagem' = 'X',
  '41-cancelamento-Viagem' = 'G',
  '43-cancelado-Viagem' = 'Y',
  '48-aguardando-Viagem' = 'T',
  '49-aguardando-Viagem' = 'V',
  '50-aguardando-Viagem' = 'F',
  '51-aguardando-Viagem' = 'B',
  '52-negado-Viagem' = 'N',
  '59-suspenso-Viagem' = 'J',
  '60-suspenso-Viagem' = 'I',
  '61-suspenso-Viagem' = 'H',
  '62-aguardando-Viagem' = 'K',
  '25-cancelado-Viagem' = 'Z',
}

export enum LetraSaqueTipoR {
  A = '26-não-Adiantamento',
  C = '27-não-Adiantam.-Complemento',
  R = '29-não-Despesas-Reembolso',
  D = '31-não-Despesas-c/Lanc.Documentos',
  P = '33-sim-Despesas-Reembolso',
  S = '36-sim-Despesas Adiant.',
  E = '38-sim-Despesas Adian.- Compl',
  X = '40-estorno-Despesas Adiantamento',
  G = '42-cancelamento-Despesas Adian.',
  Y = '44-cancelado-Despesas Adian.',
  F = '45-aguardando-Despesas Adian.',
  V = '46-aguardando-Despesas Adian.',
  T = '47-aguardando-Despesas Adian.',
  N = '53-negado-Despesas Adian.',
  H = '54-suspenso-Despesas Adian.',
  Q = '55-suspenso-Despesas Adian.',
  I = '56-suspenso-Despesas Adian.',
  J = '57-suspenso-Despesas Adian.',
  Z = '58-cancelado-Despesas Adian.',
}
export enum SaqueTipoR {
  '26-não-Adiantamento' = 'A',
  '27-não-Adiantam.-Complemento' = 'C',
  '29-não-Despesas-Reembolso' = 'R',
  '31-não-Despesas-c/Lanc.Documentos' = 'D',
  '33-sim-Despesas-Reembolso' = 'P',
  '36-sim-Despesas Adiant.' = 'S',
  '38-sim-Despesas Adian.- Compl' = 'E',
  '40-estorno-Despesas Adiantamento' = 'X',
  '42-cancelamento-Despesas Adian.' = 'G',
  '44-cancelado-Despesas Adian.' = 'Y',
  '45-aguardando-Despesas Adian.' = 'F',
  '46-aguardando-Despesas Adian.' = 'V',
  '47-aguardando-Despesas Adian.' = 'T',
  '53-negado-Despesas Adian.' = 'N',
  '54-suspenso-Despesas Adian.' = 'H',
  '55-suspenso-Despesas Adian.' = 'Q',
  '56-suspenso-Despesas Adian.' = 'I',
  '57-suspenso-Despesas Adian.' = 'J',
  '58-cancelado-Despesas Adian.' = 'Z',
}

// | sts\_id\_codigo | tipo\_saque | sqe\_efetivo | saque\_efetuado                                                | saque\_tipo                |
// | --------------- | ----------- | ------------ | -------------------------------------------------------------- | -------------------------- |
// | 25              | N           | A            | Não - Aguardar Pagamento                                       | Viagem                     |
// | 26              | R           | A            | Não - Retirar Pagamento na Tesouraria                          | Adiantamento               |
// | 27              | R           | C            | Não - Retirar Pagamento na Tesouraria                          | Adiantam.-Complemento      |
// | 28              | N           | C            | Não - Aguardar Pagamento                                       | Viagem-Complemento         |
// | 29              | R           | R            | Não - Aguardando documentos/relatório para efetuar Pagamento   | Despesas-Reembolso         |
// | 30              | N           | R            | Não - Aguardando documentos/relatório para efetuar Pagamento   | Viagem-Reembolso           |
// | 31              | R           | D            | Não - Aguardando documentos/relatório para efetuar Pagamento   | Despesas-c/Lanc.Documentos |
// | 32              | N           | D            | Não - Aguardando documentos/relatório para efetuar Pagamento   | Viagem-c/Lanc. Documentos  |
// | 33              | R           | P            | Sim - Pagamento Efetuado                                       | Despesas-Reembolso         |
// | 34              | N           | P            | Sim - Pagamento Efetuado                                       | Viagem-Reembolso           |
// | 35              | N           | S            | Sim  - Pagamento Efetuado                                      | Viagem                     |
// | 36              | R           | S            | Sim - Pagamento Efetuado                                       | Despesas Adiant.           |
// | 37              | N           | E            | Sim - Pagamento Efetuado                                       | Viagem - Complemento       |
// | 38              | R           | E            | Sim - Pagamento Efetuado                                       | Despesas Adian.- Compl     |
// | 39              | N           | X            | Estorno                                                        | Viagem                     |
// | 40              | R           | X            | Estorno                                                        | Despesas Adiantamento      |
// | 41              | N           | G            | Autorização Cancelamento pelo Financeiro                       | Viagem                     |
// | 42              | R           | G            | Autorização Cancelamento pelo Financeiro                       | Despesas Adian.            |
// | 43              | N           | Y            | Cancelamento efetuado pelo Financeiro                          | Viagem                     |
// | 44              | R           | Y            | Cancelamento efetuado pelo Financeiro                          | Despesas Adian.            |
// | 45              | R           | F            | Aguardando Transferência para Reembolso                        | Despesas Adian.            |
// | 46              | R           | V            | Aguardando Transferência para Complemento                      | Despesas Adian.            |
// | 47              | R           | T            | Aguardando Transferência para saque                            | Despesas Adian.            |
// | 48              | N           | T            | Aguardando Transferência para saque                            | Viagem                     |
// | 49              | N           | V            | Aguardando Transferência para Complemento                      | Viagem                     |
// | 50              | N           | F            | Aguardando Transferência para Reembolso                        | Viagem                     |
// | 51              | N           | B            | Aguardando Transferência para Complemento-Reembolso            | Viagem                     |
// | 52              | N           | N            | Transferência não autorizada                                   | Viagem                     |
// | 53              | R           | N            | Transferência não autorizada                                   | Despesas Adian.            |
// | 54              | R           | H            | SUSPENSO - Aguardar Transferência para Reembolso               | Despesas Adian.            |
// | 55              | R           | Q            | SUSPENSO - Aguardar Transferência para Reembolso/Com Documento | Despesas Adian.            |
// | 56              | R           | I            | SUSPENSO - Aguardar Transferência para Complemento             | Despesas Adian.            |
// | 57              | R           | J            | SUSPENSO - Aguardar Transferência para saque                   | Despesas Adian.            |
// | 58              | R           | Z            | CANCELADO - Saque cancelado pelo usuário                       | Despesas Adian.            |
// | 59              | N           | J            | SUSPENSO - Aguardar Transferência para saque                   | Viagem                     |
// | 60              | N           | I            | SUSPENSO - Aguardar Transferência para Complemento             | Viagem                     |
// | 61              | N           | H            | SUSPENSO - Aguardar Transferência para Reembolso               | Viagem                     |
// | 62              | N           | K            | Aguardando prestação de Contas para Transferência              | Viagem                     |
// | (sem código)    | N           | Z            | CANCELADO - Saque cancelado pelo usuário                       | Viagem                     |
