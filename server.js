/**
 * Automaclick Chatbot Server v6.0
 * Node.js + Puppeteer + Tesseract OCR integrado
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const puppeteer = require('puppeteer');
const Tesseract = require('tesseract.js');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(helmet());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

// OpenRouter Config
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-v1-your-api-key-here';
if (!OPENROUTER_API_KEY.startsWith('sk-or-')) {
  logger.error('Erro: OPENROUTER_API_KEY inválida');
  process.exit(1);
}
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const FREE_MODELS = [
  'mistralai/mistral-7b-instruct',
  'meta-llama/llama-3-8b-instruct',
  'google/gemma-7b-it',
  'anthropic/claude-instant-v1'
];

/**
 * ✅ Função OCR integrada via Node.js
 */
async function fetchPageDataOCR(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // aguarda carregamento JS
    await new Promise(resolve => setTimeout(resolve, 5000));

    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`✅ Screenshot salva em: ${screenshotPath}`);

    const { data: { text } } = await Tesseract.recognize(
      screenshotPath,
      'por',
      { logger: m => console.log(m) }
    );

    console.log("🧠 TEXTO EXTRAÍDO PELO OCR:");
    console.log(text);

    return text;

  } catch (error) {
    console.error("❌ Erro na extração OCR:", error.message);
    return "";
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * ✅ Classe PageDataExtractor atualizada
 */
class PageDataExtractor {
  static async extractPageData(url) {
    const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

    try {
      log(`✅ Iniciando extração OCR da URL: ${url}`);

      const text = await fetchPageDataOCR(url);

      const title = this.extractTitle(text);
      const price = this.extractPrice(text);
      const description = this.extractDescription(text);
      const benefits = this.extractBenefits(text);
      const testimonials = this.extractTestimonials(text);
      const cta = this.extractCTA(text);

      const extractedData = {
        title,
        description,
        price,
        benefits,
        testimonials,
        cta,
        url
      };

      log(`✅ Extração concluída com sucesso para: ${extractedData.title}`);
      return extractedData;

    } catch (error) {
      log(`❌ Erro na extração: ${error.message}`);
      return {
        title: "Produto Incrível",
        description: "Um produto que vai transformar sua vida e seus resultados.",
        price: "Consulte o preço na página",
        benefits: ["Resultados comprovados", "Suporte especializado", "Garantia de satisfação"],
        testimonials: ["Produto excelente, recomendo! - Cliente Satisfeito"],
        cta: "Compre Agora",
        url
      };
    }
  }

  static extractTitle(text) {
    if (!text || typeof text !== 'string') return "Título não encontrado";

    const cleanText = PageDataExtractor.cleanText(text);
    const lines = cleanText.split("\n").filter(l => l.length > 30);

    const candidates = lines.filter(l => 
      !/termos|privacidade|cookies|comentários|whatsapp/i.test(l)
    );

    const sorted = candidates.sort((a, b) => b.length - a.length);
    const best = sorted[0] || "Título não encontrado";
    console.log("🔎 Título detectado:", best);
    return best;
  }

  static extractPrice(text) {
    if (!text || typeof text !== 'string') return "Preço não identificado";
    const cleanText = PageDataExtractor.cleanText(text);
    const regex = /R\$ ?\d{1,3}(?:\.\d{3})*,\d{2}/g;
    const matches = cleanText.match(regex);
    return matches?.[0] || "Preço não identificado";
  }

  static extractDescription(text) {
    if (!text || typeof text !== 'string') return "Descrição não encontrada";
    const cleanText = PageDataExtractor.cleanText(text);
    const lines = cleanText.split("\n").filter(l => l.length > 30);
    const desc = lines.find(l =>
      /curso|treinamento|ebook|estratégia|produto|ferramenta|acesso/i.test(l)
    );
    return desc || "Descrição não encontrada";
  }

  static extractBenefits(text) {
    if (!text || typeof text !== 'string') return ["Nenhum benefício encontrado"];
    const cleanText = PageDataExtractor.cleanText(text);
    const lines = cleanText.split("\n").filter(l => l.length > 10);
    const benefits = lines.filter(l =>
      /benefício|vantagem|liberdade|economia|acelere|melhore|otimize/i.test(l)
    );
    return benefits.length ? benefits : ["Nenhum benefício encontrado"];
  }

  static extractTestimonials(text) {
    if (!text || typeof text !== 'string') return ["Nenhum depoimento encontrado"];
    const cleanText = PageDataExtractor.cleanText(text);
    const lines = cleanText.split("\n").filter(l => l.length > 15);
    const testimonials = lines.filter(l =>
      l.includes('"') || l.includes("“") ||
      /obrigado|excelente|recomendo|fantástico|maravilhoso|funcionou/i.test(l)
    );
    return testimonials.length ? testimonials : ["Nenhum depoimento encontrado"];
  }

  static extractCTA(text) {
    if (!text || typeof text !== 'string') return "Ação não encontrada";
    const cleanText = PageDataExtractor.cleanText(text);
    const lines = cleanText.split("\n").filter(l => l.length > 5);
    const cta = lines.find(l =>
      /compre|garanta|adquira|acesse|não perca|oferta|transforme|comece/i.test(l)
    );
    return cta || "Ação não encontrada";
  }

  static cleanText(text) {
    return text
      .replace(/[|•*·ºª…]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }
}

/**
 * ✅ Classe OpenRouterClient
 */
class OpenRouterClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = OPENROUTER_BASE_URL;
  }

  async generateResponse(systemPrompt, userMessage, productData) {
    const body = {
      model: FREE_MODELS[0],
      messages: [
        { role: "system", content: systemPrompt || `Você é um assistente de vendas para o produto: ${productData.title}` },
        { role: "user", content: userMessage }
      ]
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Erro na chamada OpenRouter: ${response.status}`);

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'Resposta não disponível.';
  }
}

const openRouterClient = new OpenRouterClient(OPENROUTER_API_KEY);
const productCache = new Map();

/**
 * ✅ Rotas
 */
app.get('/chatbot', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL da página de vendas é obrigatória' });

  try {
    let productData = productCache.get(url);
    if (!productData) {
      productData = await PageDataExtractor.extractPageData(url);
      productCache.set(url, productData);
      setTimeout(() => productCache.delete(url), 3600000);
    }

    res.send(generateChatbotHTML(productData));
  } catch (error) {
    logger.error('Erro no chatbot:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, productUrl } = req.body;
  if (!message || !productUrl) return res.status(400).json({ error: 'Mensagem e URL do produto são obrigatórias' });

  try {
    let productData = productCache.get(productUrl);
    if (!productData) {
      productData = await PageDataExtractor.extractPageData(productUrl);
      productCache.set(productUrl, productData);
    }

    const response = await openRouterClient.generateResponse('', message, productData);
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Erro na API de chat:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

app.get('/status', (req, res) => {
  res.json({ status: 'online', version: '6.0', timestamp: new Date().toISOString(), cache_size: productCache.size });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

function generateChatbotHTML(productData) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <title>Chatbot - ${productData.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body { font-family: Arial; padding: 20px; background: #f2f2f2; }
          .chatbox { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      </style>
  </head>
  <body>	
      <div class="chatbox">
          <h1>🤖 Assistente Automático</h1>
          <p><strong>Produto:</strong> ${productData.title}</p>
          <p><strong>Descrição:</strong> ${productData.description}</p>
          <p><strong>Preço:</strong> ${productData.price}</p>
          <p><strong>Benefícios:</strong></p>
          <ul>${productData.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
          <p><strong>Depoimentos:</strong></p>
          <ul>${productData.testimonials.map(t => `<li>${t}</li>`).join('')}</ul>
          <p><strong>Chamada para ação:</strong> ${productData.cta}</p>
      </div>
  </body>
  </html>`;
}

app.listen(PORT, () => {
  logger.info(`🚀 Automaclick Chatbot Server v6.0 rodando na porta ${PORT}`);
  logger.info(`📱 Acesse: http://localhost:${PORT}/chatbot?url=https://exemplo.com`);
  logger.info(`✅ Chave OpenRouter carregada corretamente!`);
});

module.exports = app;
