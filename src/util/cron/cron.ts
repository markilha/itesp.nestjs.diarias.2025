import cron from 'node-cron';
function resetSaldo() {
  console.log('Saldo zerado no início do mês!');
}

cron.schedule('0 0 1 * *', () => {
  resetSaldo();
});

export {};
