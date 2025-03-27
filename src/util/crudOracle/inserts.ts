export const inserts = {
  insertAutorizaTransporte: `
    Insert Into Transporte.S001_AUTORIZA values
    (:par1, :par2, :par3,'R',:par4,:par5,SYSDATE)
    `,
};
