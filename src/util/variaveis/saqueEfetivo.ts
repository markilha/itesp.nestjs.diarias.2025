const combinacoes = [
  { SQE_EFETIVO: 'A', TIPO: 'Viagem', EFETUADO: 'Não - Aguardar Pagamento' },
  {
    SQE_EFETIVO: 'C',
    TIPO: 'Viagem-Complemento',
    EFETUADO: 'Não - Aguardar Pagamento',
  },
  {
    SQE_EFETIVO: 'R',
    TIPO: 'Viagem-Reembolso',
    EFETUADO: 'Não - Aguardando documentos/relatório para efetuar Pagamento',
  },
  {
    SQE_EFETIVO: 'D',
    TIPO: 'Viagem-c/Lanc. Documentos',
    EFETUADO: 'Não - Aguardando documentos/relatório para efetuar Pagamento',
  },

  {
    SQE_EFETIVO: 'P',
    TIPO: 'Viagem-Reembolso',
    EFETUADO: 'Sim - Pagamento Efetuado',
  },
  { SQE_EFETIVO: 'S', TIPO: 'Viagem', EFETUADO: 'Sim  - Pagamento Efetuado' },

  {
    SQE_EFETIVO: 'E',
    TIPO: 'Viagem - Complemento',
    EFETUADO: 'Sim - Pagamento Efetuado',
  },

  { SQE_EFETIVO: 'X', TIPO: 'Viagem', EFETUADO: 'Estorno' },
  {
    SQE_EFETIVO: 'G',
    TIPO: 'Viagem',
    EFETUADO: 'Autorização Cancelamento pelo Financeiro',
  },
  {
    SQE_EFETIVO: 'Y',
    TIPO: 'Viagem',
    EFETUADO: 'Cancelamento efetuado pelo Financeiro',
  },
  {
    SQE_EFETIVO: 'Z',
    TIPO: 'Viagem',
    EFETUADO: 'Cancelamento efetuado pelo usuário',
  },

  {
    SQE_EFETIVO: 'T',
    TIPO: 'Viagem',
    EFETUADO: 'Aguardando Transferência para saque',
  },
  {
    SQE_EFETIVO: 'V',
    TIPO: 'Viagem',
    EFETUADO: 'Aguardando Transferência para Complemento',
  },
  {
    SQE_EFETIVO: 'F',
    TIPO: 'Viagem',
    EFETUADO: 'Aguardando Transferência para Reembolso',
  },
  {
    SQE_EFETIVO: 'B',
    TIPO: 'Viagem',
    EFETUADO: 'Aguardando Transferência para Complemento-Reembolso',
  },
];
