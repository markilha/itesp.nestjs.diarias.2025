export const updates = {
  updateAutorizaItem: `
    UPDATE Financeiro.S009_ITENSREQREC
    SET sts_id_codigo = '6', irr_valor_conc = :valorSolicitado, irr_recurso = 'S'
    WHERE ite_id_codigo = :itemId`,
  updateUsuReq: `
    UPDATE TRANSPORTE.S001_USUREQ SET                  
    CHAPA = :par2,
    USU_MOV = :par3
    WHERE REQ_ID_CODIGO = :par1 
    AND CHAPA = :par2`,
  updateStatusRequisicao: `
    Update Transporte.S001_REQUISICAO Set             
    REQ_STATUS=:par2
    where REQ_id_codigo=:par1
    `,
};
