/**
 * Automaclick Chatbot Server v6.0
 * Servidor Node.js para integração com OpenRouter e chatbot autônomo
 * 
 * Funcionalidades:
 * - Extração de dados de páginas de vendas
 * - Integração com API OpenRouter (modelos gratuitos)
 * - Interface de chatbot em tempo real
 * - Escalabilidade para milhares de afiliados
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite por IP
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(helmet());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do OpenRouter
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-v1-your-api-key-here';
if (!OPENROUTER_API_KEY.startsWith('sk-or-')) {
  logger.error('Erro: OPENROUTER_API_KEY inválida');
  process.exit(1);
}
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Modelos gratuitos disponíveis
const FREE_MODELS = [
  'mistralai/mistral-7b-instruct',       // Rápido e eficiente
  'meta-llama/llama-3-8b-instruct',      // Versão mais recente
  'google/gemma-7b-it',                  // Novo modelo da Google
  'anthropic/claude-instant-v1'          // Versão leve da Claude
];

/**
 * Classe para extração de dados de páginas de vendas
 * Baseada no motor do Automaclick v5.0
 */
class PageDataExtractor {
    static async extractPageData(url) {
        const log = (message) => logger.info(`[${new Date().toISOString()}] ${message}`);
        
        try {
            log(`Iniciando extração de dados da URL: ${url}`);
            
            // Usar proxy CORS para contornar limitações
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const html = data.contents;
            
            // Extrair dados usando regex e parsing HTML
            const extractedData = {
                title: this.extractTitle(html),
                description: this.extractDescription(html),
                price: this.extractPrice(html),
                benefits: this.extractBenefits(html),
                testimonials: this.extractTestimonials(html),
                cta: this.extractCTA(html),
                url: url
            };

            log(`Extração concluída com sucesso para: ${extractedData.title}`);
            return extractedData;

        } catch (error) {
            log(`Erro na extração: ${error.message}`);
            
            // Retornar dados padrão em caso de falha
            return {
                title: "Produto Incrível",
                description: "Um produto que vai transformar sua vida e seus resultados.",
                price: "Consulte o preço na página",
                benefits: [
                    "Resultados comprovados",
                    "Suporte especializado", 
                    "Garantia de satisfação"
                ],
                testimonials: [
                    "Produto excelente, recomendo! - Cliente Satisfeito"
                ],
                cta: "Compre Agora",
                url: url
            };
        }
    }

    // ... (os métodos extractTitle, extractDescription, etc. permanecem os mesmos)
}

/**
 * Classe para integração com OpenRouter
 */
class OpenRouterClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = OPENROUTER_BASE_URL;
    }

    // ... (os métodos generateResponse, buildSystemPrompt, etc. permanecem os mesmos)
}

// Instância do cliente OpenRouter
const openRouterClient = new OpenRouterClient(OPENROUTER_API_KEY);

// Cache para dados de produtos (evitar re-extrações desnecessárias)
const productCache = new Map();

/**
 * Rota principal do chatbot
 */
app.get('/chatbot', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ 
            error: 'URL da página de vendas é obrigatória' 
        });
    }

    try {
        // Verificar cache primeiro
        let productData = productCache.get(url);
        
        if (!productData) {
            // Extrair dados da página
            productData = await PageDataExtractor.extractPageData(url);
            
            // Armazenar no cache por 1 hora
            productCache.set(url, productData);
            setTimeout(() => productCache.delete(url), 3600000);
        }

        // Renderizar página do chatbot
        res.send(generateChatbotHTML(productData));
        
    } catch (error) {
        logger.error('Erro no chatbot:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * API para enviar mensagens ao chatbot
 */
app.post('/api/chat', async (req, res) => {
    const { message, productUrl } = req.body;
    
    if (!message || !productUrl) {
        return res.status(400).json({ 
            error: 'Mensagem e URL do produto são obrigatórias' 
        });
    }

    try {
        // Obter dados do produto (do cache ou extrair)
        let productData = productCache.get(productUrl);
        
        if (!productData) {
            productData = await PageDataExtractor.extractPageData(productUrl);
            productCache.set(productUrl, productData);
        }

        // Gerar resposta usando OpenRouter
        const response = await openRouterClient.generateResponse(
            '', // prompt não usado nesta versão
            message,
            productData
        );

        res.json({
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Erro na API de chat:', error);
        res.status(500).json({ 
            error: 'Erro ao processar mensagem' 
        });
    }
});

// ... (a função generateChatbotHTML permanece a mesma)

// Rota de status
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        version: '6.0',
        timestamp: new Date().toISOString(),
        cache_size: productCache.size
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Iniciar servidor
app.listen(PORT, () => {
    logger.info(`🚀 Automaclick Chatbot Server v6.0 rodando na porta ${PORT}`);
    logger.info(`📱 Acesse: http://localhost:${PORT}/chatbot?url=https://exemplo.com`);
    logger.info(`🔑 Configure sua chave OpenRouter na variável OPENROUTER_API_KEY`);
});

module.exports = app;