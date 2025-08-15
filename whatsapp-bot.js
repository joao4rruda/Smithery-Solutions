const { chromium } = require('playwright');

const CONTACT_NAME = 'Empresa'; // Altere para o nome do contato ou número
const MENSAGENS = [
  "Como está o seu dia?",
  "Você gosta de tecnologia?",
  "Já ouviu falar em inteligência artificial?",
  "Qual seu hobby favorito?",
  "Me conte uma curiosidade sobre você!"
];

function getRandomMessage() {
  return MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com/');

  console.log('Por favor, escaneie o QR Code e pressione Enter aqui quando estiver pronto.');
  process.stdin.once('data', async () => {
    // Pesquisar e abrir a conversa
    await page.click('text=Nova conversa');
    await page.fill('input[title="Pesquisar nome ou número"]', CONTACT_NAME);
    await page.waitForTimeout(2000);
    await page.click(`text=${CONTACT_NAME}`);

    let lastMessage = '';

    while (true) {
      // Pega a última mensagem recebida
      const messages = await page.$$eval('div.message-in span.selectable-text', spans =>
        spans.map(span => span.textContent)
      );
      const latest = messages[messages.length - 1];

      if (latest && latest !== lastMessage) {
        lastMessage = latest;
        const resposta = getRandomMessage();
        await page.fill('div[title="Digite uma mensagem"]', resposta);
        await page.keyboard.press('Enter');
        console.log('Mensagem enviada:', resposta);
      }

      await page.waitForTimeout(5000); // Espera 5 segundos antes de checar novamente
    }
  });
})();