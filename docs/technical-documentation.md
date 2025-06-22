# 📚 Documentação Técnica - Link Mágico

## 🏗️ Arquitetura do Sistema

### 📋 Visão Geral

O Link Mágico é composto por três componentes principais que trabalham em conjunto para fornecer automação de respostas via ChatGPT:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Painel Web    │    │  Google Tag     │    │  Script de      │
│   (Frontend)    │───▶│  Manager        │───▶│  Automação      │
│                 │    │  (Trigger)      │    │  (Backend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Geração de    │    │   Detecção de   │    │   Automação     │
│   Links         │    │   Parâmetros    │    │   ChatGPT +     │
│                 │    │                 │    │   Redes Sociais │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Componentes Detalhados

#### 1. Painel Web (Frontend)
- **Tecnologia**: HTML5, CSS3, JavaScript ES6+
- **Responsabilidade**: Interface para geração de links
- **Arquivos**: `panel/index.html`
- **Funcionalidades**:
  - Seleção de redes sociais
  - Validação de formulário
  - Geração de URLs parametrizadas
  - Cópia para área de transferência

#### 2. Google Tag Manager (Trigger)
- **Tecnologia**: GTM Container, JavaScript
- **Responsabilidade**: Detecção e execução condicional
- **Arquivos**: `gtm/gtm-container.json`
- **Funcionalidades**:
  - Trigger baseado em parâmetros URL
  - Carregamento dinâmico do script
  - Variáveis personalizadas
  - Debug e monitoramento

#### 3. Script de Automação (Backend)
- **Tecnologia**: JavaScript ES6+, DOM Manipulation, Browser APIs
- **Responsabilidade**: Automação e redirecionamento
- **Arquivos**: `automation/script.js`
- **Funcionalidades**:
  - Automação do ChatGPT
  - Redirecionamento para redes sociais
  - Tratamento de erros
  - Logging e notificações

## 🔌 API Interna

### 📡 Módulo Utils

```javascript
/**
 * Utilitários gerais do Link Mágico
 * @namespace Utils
 */
const Utils = {
  /**
   * Extrai parâmetros da URL atual
   * @returns {Object} Objeto com parâmetros rede e user
   * @example
   * // URL: https://site.com?rede=whatsapp&user=teste
   * const params = Utils.getUrlParams();
   * // Retorna: { rede: 'whatsapp', user: 'teste' }
   */
  getUrlParams: function() {
    const params = new URLSearchParams(window.location.search);
    return {
      rede: params.get('rede'),
      user: params.get('user')
    };
  },

  /**
   * Faz log com timestamp e tipo
   * @param {string} message - Mensagem a ser logada
   * @param {string} type - Tipo do log (info, error, success)
   * @example
   * Utils.log('Operação concluída', 'success');
   */
  log: function(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] Link Mágico:`;
    
    switch(type) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'success':
        console.log(`%c${prefix} ${message}`, 'color: green; font-weight: bold;');
        break;
      default:
        console.log(prefix, message);
    }
  },

  /**
   * Exibe overlay de notificação na tela
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo da notificação (info, error, success)
   * @returns {HTMLElement} Elemento do overlay criado
   * @example
   * Utils.showOverlay('Link Mágico iniciado!', 'info');
   */
  showOverlay: function(message, type = 'info') {
    // Implementação completa no arquivo source
  },

  /**
   * Aguarda elemento aparecer no DOM
   * @param {string} selector - Seletor CSS do elemento
   * @param {number} timeout - Timeout em milissegundos (padrão: 10000)
   * @returns {Promise<HTMLElement>} Promise que resolve com o elemento
   * @example
   * const button = await Utils.waitForElement('#submit-btn', 5000);
   */
  waitForElement: function(selector, timeout = 10000) {
    // Implementação com MutationObserver
  }
};
```

### 🤖 Módulo ChatGPTAutomation

```javascript
/**
 * Automação do ChatGPT
 * @namespace ChatGPTAutomation
 */
const ChatGPTAutomation = {
  /**
   * Verifica se está na página do ChatGPT
   * @returns {boolean} True se estiver na página do ChatGPT
   */
  isChatGPTPage: function() {
    return window.location.hostname.includes('chat.openai.com');
  },

  /**
   * Envia mensagem para o ChatGPT automaticamente
   * @param {string} message - Mensagem a ser enviada
   * @returns {Promise<string>} Promise que resolve com a resposta do ChatGPT
   * @example
   * const response = await ChatGPTAutomation.sendMessage('Olá!');
   * console.log('Resposta:', response);
   */
  sendMessage: async function(message) {
    try {
      Utils.log('Enviando mensagem para o ChatGPT...');
      
      // Aguarda o campo de input aparecer
      const inputSelector = 'textarea[placeholder*="Message"], textarea[data-id="root"], #prompt-textarea';
      const inputElement = await Utils.waitForElement(inputSelector);
      
      // Insere a mensagem
      inputElement.value = message;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Procura e clica no botão de envio
      const sendButton = await this.findSendButton();
      if (sendButton) {
        sendButton.click();
        Utils.log('Mensagem enviada com sucesso!', 'success');
        
        // Aguarda e captura a resposta
        return await this.captureResponse();
      } else {
        throw new Error('Botão de envio não encontrado');
      }
    } catch (error) {
      Utils.log(`Erro ao enviar mensagem: ${error.message}`, 'error');
      return CONFIG.defaultMessage;
    }
  },

  /**
   * Encontra o botão de envio do ChatGPT
   * @private
   * @returns {Promise<HTMLElement|null>} Elemento do botão ou null
   */
  findSendButton: async function() {
    const selectors = [
      'button[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      'button[type="submit"]',
      'button:has(svg)'
    ];
    
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled) {
        return button;
      }
    }
    return null;
  },

  /**
   * Captura a resposta do ChatGPT
   * @private
   * @returns {Promise<string>} Resposta capturada
   */
  captureResponse: async function() {
    // Aguarda a resposta aparecer
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const responseSelectors = [
      '[data-message-author-role="assistant"] .markdown',
      '.group\\/conversation-turn .markdown',
      '.prose'
    ];
    
    for (const selector of responseSelectors) {
      const responseElement = document.querySelector(selector);
      if (responseElement) {
        const response = responseElement.textContent.trim();
        Utils.log('Resposta capturada do ChatGPT', 'success');
        return response;
      }
    }
    
    Utils.log('Não foi possível capturar a resposta, usando mensagem padrão');
    return CONFIG.defaultMessage;
  }
};
```

### 📱 Módulo SocialNetworkRedirect

```javascript
/**
 * Redirecionamento para redes sociais
 * @namespace SocialNetworkRedirect
 */
const SocialNetworkRedirect = {
  /**
   * Redireciona para WhatsApp Web
   * @param {string} message - Mensagem a ser enviada
   * @param {string} user - Número de telefone (opcional)
   * @returns {string} URL gerada
   * @example
   * const url = SocialNetworkRedirect.redirectToWhatsApp('Olá!', '5511999999999');
   */
  redirectToWhatsApp: function(message, user) {
    const encodedMessage = encodeURIComponent(message);
    let url = CONFIG.networks.whatsapp.urlTemplate.replace('{message}', encodedMessage);
    
    // Se user é um número de telefone, usa wa.me
    if (user && user.match(/^\d+$/)) {
      url = `https://wa.me/${user}?text=${encodedMessage}`;
    }
    
    Utils.log(`Redirecionando para WhatsApp: ${url}`);
    window.open(url, '_blank');
    return url;
  },

  /**
   * Redireciona para Instagram DM
   * @param {string} message - Mensagem (não usado pelo Instagram)
   * @param {string} user - Nome de usuário do Instagram
   * @returns {string} URL gerada
   */
  redirectToInstagram: function(message, user) {
    let url = 'https://www.instagram.com/direct/inbox/';
    
    if (user) {
      url = CONFIG.networks.instagram.urlTemplate.replace('{user}', user);
    }
    
    Utils.log(`Redirecionando para Instagram: ${url}`);
    window.open(url, '_blank');
    return url;
  },

  /**
   * Redireciona para Facebook Messenger
   * @param {string} message - Mensagem (não usado pelo Messenger)
   * @param {string} user - Nome de usuário do Facebook
   * @returns {string} URL gerada
   */
  redirectToMessenger: function(message, user) {
    let url = 'https://www.messenger.com/';
    
    if (user) {
      url = CONFIG.networks.messenger.urlTemplate.replace('{user}', user);
    }
    
    Utils.log(`Redirecionando para Messenger: ${url}`);
    window.open(url, '_blank');
    return url;
  },

  /**
   * Executa redirecionamento para múltiplas redes
   * @param {string} message - Mensagem a ser enviada
   * @param {string} user - Nome de usuário
   * @param {Array<string>} networks - Array de redes sociais
   * @example
   * SocialNetworkRedirect.redirectToMultiple(
   *   'Olá!', 
   *   'usuario', 
   *   ['whatsapp', 'instagram']
   * );
   */
  redirectToMultiple: function(message, user, networks) {
    networks.forEach((network, index) => {
      setTimeout(() => {
        const methodName = `redirectTo${network.charAt(0).toUpperCase() + network.slice(1)}`;
        if (this[methodName]) {
          this[methodName](message, user);
        } else {
          Utils.log(`Método ${methodName} não encontrado`, 'error');
        }
      }, index * 1000); // Delay de 1 segundo entre cada redirecionamento
    });
  }
};
```

## 🔧 Configuração Avançada

### 📊 Configurações do Sistema

```javascript
/**
 * Configurações globais do Link Mágico
 * @constant {Object} CONFIG
 */
const CONFIG = {
  // URL base do ChatGPT
  chatGPTUrl: 'https://chat.openai.com/',
  
  // Mensagem padrão quando automação falha
  defaultMessage: 'Olá! Em que posso ajudar hoje?',
  
  // Delay entre redirecionamentos (ms)
  redirectDelay: 1000,
  
  // Timeout para aguardar elementos (ms)
  elementTimeout: 10000,
  
  // Configurações de redes sociais
  networks: {
    whatsapp: {
      name: 'WhatsApp',
      urlTemplate: 'https://web.whatsapp.com/send?text={message}',
      mobileUrlTemplate: 'https://wa.me/{user}?text={message}',
      icon: '📱',
      supportsUser: true,
      userFormat: 'phone' // 'phone', 'username', 'id'
    },
    instagram: {
      name: 'Instagram DM',
      urlTemplate: 'https://ig.me/m/{user}',
      fallbackUrl: 'https://www.instagram.com/direct/inbox/',
      icon: '📸',
      supportsUser: true,
      userFormat: 'username'
    }
    // ... outras redes
  },
  
  // Configurações de debug
  debug: {
    enabled: false,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    showOverlays: true
  }
};
```

### 🎨 Personalização de Temas

```css
/* Variáveis CSS para personalização */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  
  --overlay-z-index: 10000;
  --overlay-duration: 5000ms;
}

/* Tema escuro */
[data-theme="dark"] {
  --primary-color: #4a90e2;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333333;
}
```

### 📱 Configuração Mobile

```javascript
/**
 * Detecta se está em dispositivo móvel
 * @returns {boolean} True se for mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Configurações específicas para mobile
 */
const MOBILE_CONFIG = {
  // URLs específicas para apps nativos
  whatsappApp: 'whatsapp://send?text={message}',
  instagramApp: 'instagram://user?username={user}',
  
  // Timeouts menores para mobile
  elementTimeout: 5000,
  redirectDelay: 500,
  
  // Configurações de touch
  touchEnabled: true,
  swipeGestures: false
};
```

## 🧪 Testes e Qualidade

### 📋 Estrutura de Testes

```
tests/
├── setup.js              # Configuração global dos testes
├── script.test.js         # Testes do script de automação
├── panel.test.js          # Testes do painel web
├── integration.test.js    # Testes de integração
├── e2e.test.js           # Testes end-to-end
└── utils/
    ├── mocks.js          # Mocks e stubs
    ├── fixtures.js       # Dados de teste
    └── helpers.js        # Funções auxiliares
```

### 🔍 Estratégia de Testes

#### Testes Unitários
- **Cobertura**: 95%+ de cobertura de código
- **Foco**: Funções individuais e módulos isolados
- **Ferramentas**: Jest, JSDOM
- **Execução**: A cada commit

#### Testes de Integração
- **Foco**: Interação entre módulos
- **Cenários**: Fluxos completos de uso
- **Mocks**: APIs externas e DOM
- **Execução**: A cada pull request

#### Testes End-to-End
- **Foco**: Experiência completa do usuário
- **Ferramentas**: Playwright, Puppeteer
- **Ambientes**: Múltiplos navegadores
- **Execução**: Antes de releases

### 🔧 Configuração de CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        
    - name: Install dependencies
      run: |
        cd tests/
        npm ci
        
    - name: Run tests
      run: |
        cd tests/
        npm test -- --coverage
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## 🚀 Deploy e Produção

### 📦 Build Process

```bash
# Script de build
#!/bin/bash

echo "🏗️ Iniciando build do Link Mágico..."

# Validar arquivos
echo "✅ Validando arquivos..."
if [ ! -f "panel/index.html" ]; then
  echo "❌ Arquivo panel/index.html não encontrado"
  exit 1
fi

# Minificar CSS e JS (opcional)
echo "🗜️ Minificando arquivos..."
# npx terser automation/script.js -o automation/script.min.js

# Validar HTML
echo "🔍 Validando HTML..."
# npx html-validate panel/index.html

# Executar testes
echo "🧪 Executando testes..."
cd tests/
npm test

# Gerar documentação
echo "📚 Gerando documentação..."
# npx jsdoc automation/script.js -d docs/

echo "✅ Build concluído com sucesso!"
```

### 🌐 Configuração de Produção

```javascript
// Configurações específicas para produção
const PRODUCTION_CONFIG = {
  // URLs de produção
  baseUrl: 'https://linkmagico.app',
  cdnUrl: 'https://cdn.linkmagico.app',
  
  // Analytics
  googleAnalyticsId: 'GA-XXXXXXXXX',
  gtmId: 'GTM-XXXXXXX',
  
  // Performance
  enableCaching: true,
  compressionEnabled: true,
  
  // Segurança
  enableCSP: true,
  httpsOnly: true,
  
  // Monitoramento
  errorReporting: {
    enabled: true,
    service: 'sentry',
    dsn: 'https://xxx@sentry.io/xxx'
  }
};
```

### 📊 Monitoramento

```javascript
/**
 * Sistema de monitoramento e métricas
 */
const Monitoring = {
  /**
   * Rastreia uso do Link Mágico
   * @param {Object} data - Dados do evento
   */
  trackUsage: function(data) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'link_magico_used', {
        networks: data.networks.join(','),
        has_user: !!data.user,
        timestamp: Date.now()
      });
    }
    
    // Métricas customizadas
    this.sendMetrics({
      event: 'usage',
      data: data,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Rastreia erros
   * @param {Error} error - Erro ocorrido
   * @param {Object} context - Contexto do erro
   */
  trackError: function(error, context) {
    console.error('Link Mágico Error:', error, context);
    
    // Sentry ou similar
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error, {
        tags: {
          component: 'link-magico'
        },
        extra: context
      });
    }
  },

  /**
   * Envia métricas para backend
   * @param {Object} metrics - Dados das métricas
   */
  sendMetrics: function(metrics) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', JSON.stringify(metrics));
    } else {
      fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify(metrics),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.warn('Falha ao enviar métricas:', error);
      });
    }
  }
};
```

## 🔒 Segurança

### 🛡️ Medidas de Segurança

#### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://chat.openai.com;
  frame-src 'none';
">
```

#### Validação de Entrada
```javascript
/**
 * Valida e sanitiza entrada do usuário
 * @param {string} input - Entrada do usuário
 * @returns {string} Entrada sanitizada
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove caracteres perigosos
  return input
    .replace(/[<>\"']/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .substring(0, 100); // Limita tamanho
}

/**
 * Valida formato de nome de usuário
 * @param {string} username - Nome de usuário
 * @returns {boolean} True se válido
 */
function validateUsername(username) {
  const pattern = /^[a-zA-Z0-9._-]+$/;
  return pattern.test(username) && username.length <= 50;
}
```

#### Rate Limiting
```javascript
/**
 * Sistema simples de rate limiting
 */
const RateLimit = {
  requests: new Map(),
  
  /**
   * Verifica se pode fazer requisição
   * @param {string} key - Chave única (IP, user, etc.)
   * @param {number} limit - Limite de requisições
   * @param {number} window - Janela de tempo (ms)
   * @returns {boolean} True se pode fazer requisição
   */
  canMakeRequest: function(key, limit = 10, window = 60000) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove requisições antigas
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
};
```

## 📈 Performance

### ⚡ Otimizações

#### Lazy Loading
```javascript
/**
 * Carrega script de automação apenas quando necessário
 */
function loadAutomationScript() {
  if (document.getElementById('automation-script')) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'automation-script';
    script.src = '/automation/script.js';
    script.async = true;
    
    script.onload = resolve;
    script.onerror = reject;
    
    document.head.appendChild(script);
  });
}
```

#### Caching
```javascript
/**
 * Sistema de cache simples
 */
const Cache = {
  storage: new Map(),
  
  /**
   * Armazena valor no cache
   * @param {string} key - Chave
   * @param {*} value - Valor
   * @param {number} ttl - Time to live (ms)
   */
  set: function(key, value, ttl = 300000) { // 5 minutos padrão
    this.storage.set(key, {
      value,
      expires: Date.now() + ttl
    });
  },
  
  /**
   * Recupera valor do cache
   * @param {string} key - Chave
   * @returns {*} Valor ou null se expirado
   */
  get: function(key) {
    const item = this.storage.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.storage.delete(key);
      return null;
    }
    
    return item.value;
  }
};
```

---

**📝 Nota**: Esta documentação é atualizada automaticamente. Para contribuições, consulte o [Guia de Contribuição](CONTRIBUTING.md).

**🔗 Links Úteis**:
- [Manual do Usuário](manual/manual.md)
- [Guia de Instalação](README.md#instalação)
- [Exemplos de Uso](README.md#uso)
- [Suporte](README.md#suporte)

