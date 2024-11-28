export function obterParametros(rgReembolsar, semrec, rgComplemento, reembCompl, cbCodDesp) {
    let PAR11 = "";
    let PAR15 = 0;
  
    if (rgReembolsar === 0 && semrec >= 1 && cbCodDesp === "7") {
      PAR11 = "K"; // Reembolso/TRANSFERENCIA
      PAR15 = 61;
    } else if (rgReembolsar=== 0 && semrec >= 1 && reembCompl === 1) {
      PAR11 = "B"; // Aguardando Transferência para Complemento-Reembolso
      PAR15 = 51;
    } else if (rgReembolsar=== 0 && semrec >= 1) {
      PAR11 = "F"; // Aguardando Transferência para Reembolso
      PAR15 = 45;
    } else if (rgReembolsar === 0) {
      PAR11 = "R"; // Aguardando documentos/relatório para efetuar Pagamento
      PAR15 = 29;
    } else if (rgComplemento === 1 && semrec >= 1) {
      PAR11 = "T"; // Aguardando Transferência para saque
      PAR15 = 47;
    } else if (rgComplemento === 1) {
      PAR11 = "A"; // Aguardado Saque
      PAR15 = 25;
    } else if (rgComplemento === 0 && semrec >= 1) {
      PAR11 = "V"; // Aguardando Transferência para Complemento
      PAR15 = 46;
    } else if (rgComplemento=== 0) {
      PAR11 = "C"; // Viagem-Complemento
      PAR15 = 27;
    }
  
    return { PAR11, PAR15 };
  }
  
  // Exemplo de uso:
  const rgReembolsar = 0;
  const semrec = 2;
  const rgComplemento = 1;
  const reembCompl = 1;
  const cbCodDesp = "7";
  
  
  const parametros = obterParametros(rgReembolsar, semrec, rgComplemento, reembCompl, cbCodDesp);
  console.log(parametros); // { PAR11: "K", PAR15: 61 }
  