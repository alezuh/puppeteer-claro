const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/gerar-link-claro', async (req, res) => {
  const { cpf, telefone, pdv } = req.body;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://claro.com.br/link-biometria'); // ajuste conforme necessário
    await page.type('#campo-cpf', cpf);
    await page.type('#campo-telefone', telefone);
    await page.type('#campo-pdv', pdv);

    await Promise.all([
      page.click('#botao-gerar-link'),
      page.waitForSelector('#campo-link-gerado')
    ]);

    const link = await page.$eval('#campo-link-gerado', el => el.value);
    await browser.close();

    res.json({ link });
  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor Puppeteer rodando na porta 3000');
});
