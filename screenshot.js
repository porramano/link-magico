const puppeteer = require('puppeteer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

(async () => {
  const url = 'https://www.arsenalsecretodosceos.com.br/promocao';
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 15000));

  const screenshotPath = path.join(__dirname, 'screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();
  console.log('📸 Screenshot salva com sucesso.');

  // Chama o script Python automaticamente
  exec('python extrair_texto.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar OCR: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log("🧠 Texto extraído da imagem:");
    console.log(stdout);
  });
})();
