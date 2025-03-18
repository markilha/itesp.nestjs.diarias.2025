export const exluirFuncionarioRequisicao = `
UPDATE Transporte.S001_USUREQ
SET   
    usu_mov = 'N'
WHERE 
    REQ_id_codigo = :par1 
    AND chapa = :par2
`;

export const buscarFuncionarioRequisicao = `
Select * from TRANSPORTE.S001_USUREQ
Where  usu_mov <> 'N' and req_id_codigo=:req
`;

export const atualizarRequisicaoTransporte = `
 UPDATE Transporte.S001_REQUISICAO
SET     
    REQ_STATUS = 'CANCELADA - ESTORNO'
WHERE 
    REQ_id_codigo = :par1
`;
export const alteraControleTrafego = `
UPDATE Transporte.S001_CTRAFEGO
SET     
    CTR_STATUS = 'CANCELADA'
WHERE 
    REQ_id_codigo = :par1
`;
export const alteraControleVoo = `
UPDATE Transporte.S001_RESERVA
SET     
    RES_STATUS = 'CANCELADA'
WHERE 
    REQ_id_codigo = :par1
`;

export const selecionaAutoriza = `
Select A.REQ_ID_CODIGO, A.AUT_NIVEL From Transporte.S001_Autoriza A
where a.req_id_codigo=:req
order by a.aut_nivel
`;

export const insertAutoriza = `
Insert Into Transporte.S001_AUTORIZA values (:par1, :par2, :par4,'R','N','ESTORNO DE SAQUE',:PAR3)
`;
