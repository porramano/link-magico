/**
 * Link Mágico v5.0 - Script de Automação Inteligente
 * Extração de dados, injeção de prompts e automação para redes sociais
 * 
 * @author Manus AI
 * @version 5.0.0
 * @domain arsenalsecretodosceos.com.br
 */

(function() {
    'use strict';

    // Configurações globais v5.0
    const CONFIG = {
        version: '5.0.0',
        domain: 'arsenalsecretodosceos.com.br',
        chatGPTUrl: 'https://chat.openai.com/',
        corsProxy: 'https://api.allorigins.win/get?url=',
        inactivityTimeout: 60000, // 60 segundos
        networks: {
            whatsapp: {
                name: 'WhatsApp',
                urlTemplate: 'https://web.whatsapp.com/send?text={message}',
                urlWithUser: 'https://wa.me/{user}?text={message}',
                icon: '📱',
                supportsTextInjection: true
            },
            instagram: {
                name: 'Instagram DM',
                urlTemplate: 'https://www.instagram.com/direct/inbox/',
                urlWithUser: 'https://ig.me/m/{user}',
                icon: '📸',
                supportsTextInjection: false
            },
            messenger: {
                name: 'Facebook Messenger',
                urlTemplate: 'https://www.messenger.com/',
                urlWithUser: 'https://m.me/{user}',
                icon: '💬',
                supportsTextInjection: false
            },
            tiktok: {
                name: 'TikTok',
                urlTemplate: 'https://www.tiktok.com/',
                urlWithUser: 'https://www.tiktok.com/@{user}',
                icon: '🎵',
                supportsTextInjection: false
            },
            twitter: {
                name: 'Twitter/X',
                urlTemplate: 'https://twitter.com/messages',
                urlWithUser: 'https://twitter.com/messages/compose?recipient_id={user}',
                icon: '🐦',
                supportsTextInjection: false
            },
            kwai: {
                name: 'Kwai',
                urlTemplate: 'https://www.kwai.com/',
                urlWithUser: 'https://www.kwai.com/@{user}',
                icon: '🎬',
                supportsTextInjection: false
            },
            youtube: {
                name: 'YouTube',
                urlTemplate: 'https://www.youtube.com/',
                urlWithUser: 'https://www.youtube.com/@{user}',
                icon: '🎥',
                supportsTextInjection: false
            },
            chatgpt: {
                name: 'ChatGPT',
                urlTemplate: 'https://chat.openai.com/',
                icon: '🤖',
                supportsTextInjection: true
            }
        }
    };

    // Utilitários v5.0
    const Utils = {
        /**
         * Obtém parâmetros da URL v5.0
         * @returns {Object} Objeto com os parâmetros
         */
        getUrlParams: function() {
            const params = new URLSearchParams(window.location.search);
            return {
                robo: params.get('robo'),
                pagina: params.get('pagina'),
                rede: params.get('rede'),
                user: params.get('user')
            };
        },

        /**
         * Exibe mensagem de log com timestamp
         * @param {string} message - Mensagem a ser exibida
         * @param {string} type - Tipo da mensagem (info, error, success, warning)
         */
        log: function(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[${timestamp}] Link Mágico v${CONFIG.version}:`;
            
            switch(type) {
                case 'error':
                    console.error(prefix, message);
                    break;
                case 'success':
                    console.log(`%c${prefix} ${message}`, 'color: green; font-weight: bold;');
                    break;
                case 'warning':
                    console.warn(prefix, message);
                    break;
                default:
                    console.log(prefix, message);
            }
        },

        /**
         * Aguarda um elemento aparecer na página
         * @param {string} selector - Seletor CSS do elemento
         * @param {number} timeout - Timeout em milissegundos
         * @returns {Promise} Promise que resolve quando o elemento é encontrado
         */
        waitForElement: function(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                const observer = new MutationObserver((mutations, obs) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        obs.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Elemento ${selector} não encontrado após ${timeout}ms`));
                }, timeout);
            });
        },

        /**
         * Aguarda um tempo específico
         * @param {number} ms - Milissegundos para aguardar
         * @returns {Promise}
         */
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Valida se uma URL é válida
         * @param {string} url - URL para validar
         * @returns {boolean}
         */
        isValidUrl: function(url) {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        }
    };

    // Módulo de extração de dados da página de vendas
    const PageDataExtractor = {
        /**
         * Extrai dados da página de vendas usando proxy CORS
         * @param {string} url - URL da página de vendas
         * @returns {Promise<Object>} Dados extraídos da página
         */
        extractPageData: async function(url) {
            try {
                Utils.log(`Extraindo dados da página: ${url}`);
                updateStatus('🔍 Extraindo dados da página de vendas...');
                updateProgress(20);

                const proxyUrl = CONFIG.corsProxy + encodeURIComponent(url);
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data = await response.json();
                const htmlContent = data.contents;

                // Criar um parser DOM temporário
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');

                // Extrair informações relevantes
                const pageData = {
                    title: this.extractTitle(doc),
                    description: this.extractDescription(doc),
                    price: this.extractPrice(doc),
                    benefits: this.extractBenefits(doc),
                    testimonials: this.extractTestimonials(doc),
                    cta: this.extractCTA(doc),
                    url: url
                };

                Utils.log('Dados extraídos com sucesso', 'success');
                updateProgress(40);
                return pageData;

            } catch (error) {
                Utils.log(`Erro ao extrair dados: ${error.message}`, 'error');
                
                // Retorna dados básicos em caso de erro
                return {
                    title: 'Produto/Serviço',
                    description: 'Informações sobre nosso produto/serviço',
                    price: 'Consulte o preço',
                    benefits: ['Benefício 1', 'Benefício 2'],
                    testimonials: [],
                    cta: 'Saiba mais',
                    url: url,
                    extractionError: true
                };
            }
        },

        /**
         * Extrai o título da página
         * @param {Document} doc - Documento HTML
         * @returns {string}
         */
        extractTitle: function(doc) {
            const selectors = [
                'h1',
                'title',
                '[class*="title"]',
                '[class*="heading"]',
                '.product-title',
                '.page-title'
            ];

            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element && element.textContent.trim()) {
                    return element.textContent.trim();
                }
            }

            return 'Produto/Serviço';
        },

        /**
         * Extrai a descrição da página
         * @param {Document} doc - Documento HTML
         * @returns {string}
         */
        extractDescription: function(doc) {
            const selectors = [
                'meta[name="description"]',
                'meta[property="og:description"]',
                '.description',
                '.product-description',
                'p'
            ];

            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    const content = element.getAttribute('content') || element.textContent;
                    if (content && content.trim().length > 20) {
                        return content.trim().substring(0, 200) + '...';
                    }
                }
            }

            return 'Informações sobre nosso produto/serviço';
        },

        /**
         * Extrai informações de preço
         * @param {Document} doc - Documento HTML
         * @returns {string}
         */
        extractPrice: function(doc) {
            const selectors = [
                '[class*="price"]',
                '[class*="valor"]',
                '[class*="cost"]',
                '[data-price]'
            ];

            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element && element.textContent.trim()) {
                    const text = element.textContent.trim();
                    // Procura por padrões de preço (R$, $, etc.)
                    const priceMatch = text.match(/[R$]\s*\d+[.,]?\d*/);
                    if (priceMatch) {
                        return priceMatch[0];
                    }
                }
            }

            return 'Consulte o preço';
        },

        /**
         * Extrai benefícios/características
         * @param {Document} doc - Documento HTML
         * @returns {Array}
         */
        extractBenefits: function(doc) {
            const benefits = [];
            const selectors = [
                'ul li',
                '.benefits li',
                '.features li',
                '[class*="benefit"]',
                '[class*="feature"]'
            ];

            for (const selector of selectors) {
                const elements = doc.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = element.textContent.trim();
                    if (text && text.length > 5 && text.length < 100) {
                        benefits.push(text);
                    }
                });

                if (benefits.length >= 5) break;
            }

            return benefits.length > 0 ? benefits.slice(0, 5) : ['Benefício 1', 'Benefício 2'];
        },

        /**
         * Extrai depoimentos
         * @param {Document} doc - Documento HTML
         * @returns {Array}
         */
        extractTestimonials: function(doc) {
            const testimonials = [];
            const selectors = [
                '.testimonial',
                '.review',
                '[class*="depoimento"]',
                '[class*="testemunho"]'
            ];

            for (const selector of selectors) {
                const elements = doc.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = element.textContent.trim();
                    if (text && text.length > 20 && text.length < 200) {
                        testimonials.push(text);
                    }
                });

                if (testimonials.length >= 3) break;
            }

            return testimonials.slice(0, 3);
        },

        /**
         * Extrai call-to-action
         * @param {Document} doc - Documento HTML
         * @returns {string}
         */
        extractCTA: function(doc) {
            const selectors = [
                '.cta',
                '.call-to-action',
                'button',
                '.btn',
                '[class*="comprar"]',
                '[class*="buy"]'
            ];

            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element && element.textContent.trim()) {
                    const text = element.textContent.trim();
                    if (text.length < 50) {
                        return text;
                    }
                }
            }

            return 'Saiba mais';
        }
    };

    // Módulo de geração de prompts inteligentes
    const PromptGenerator = {
        /**
         * Gera prompt personalizado baseado nos dados extraídos
         * @param {Object} pageData - Dados da página de vendas
         * @param {string} robotName - Nome do robô/assistente
         * @param {Array} networks - Redes sociais selecionadas
         * @param {string} username - Nome de usuário (opcional)
         * @returns {string} Prompt final gerado
         */
        generatePrompt: function(pageData, robotName, networks, username) {
            Utils.log('Gerando prompt personalizado...');
            updateStatus('🤖 Gerando prompt inteligente...');
            updateProgress(60);

            const prompt = `Você é ${robotName}, um assistente de vendas especializado em ${pageData.title}.

INFORMAÇÕES DO PRODUTO/SERVIÇO:
- Nome: ${pageData.title}
- Descrição: ${pageData.description}
- Preço: ${pageData.price}
- Link: ${pageData.url}

PRINCIPAIS BENEFÍCIOS:
${pageData.benefits.map(benefit => `• ${benefit}`).join('\n')}

${pageData.testimonials.length > 0 ? `DEPOIMENTOS:
${pageData.testimonials.map(testimonial => `"${testimonial}"`).join('\n')}` : ''}

INSTRUÇÕES:
1. Responda como ${robotName}, sempre de forma amigável e profissional
2. Use as informações acima para responder perguntas sobre o produto/serviço
3. Destaque os benefícios quando relevante
4. Sempre inclua o link ${pageData.url} quando apropriado
5. Mantenha respostas concisas e diretas
6. Use emojis moderadamente para tornar a conversa mais amigável

REDES SOCIAIS ATIVAS: ${networks.join(', ')}
${username ? `USUÁRIO: ${username}` : ''}

Agora responda à próxima mensagem como ${robotName}:`;

            Utils.log('Prompt gerado com sucesso', 'success');
            return prompt;
        }
    };

    // Módulo de automação do ChatGPT v5.0
    const ChatGPTAutomation = {
        /**
         * Verifica se estamos na página do ChatGPT
         * @returns {boolean}
         */
        isChatGPTPage: function() {
            return window.location.hostname.includes('chat.openai.com');
        },

        /**
         * Injeta prompt no ChatGPT com múltiplas tentativas
         * @param {string} prompt - Prompt a ser injetado
         * @returns {Promise<boolean>} Sucesso da injeção
         */
        injectPrompt: async function(prompt) {
            try {
                Utils.log('Iniciando injeção de prompt no ChatGPT...');
                updateStatus('🤖 Injetando prompt no ChatGPT...');
                updateProgress(80);

                // Aguarda a página carregar completamente
                await Utils.sleep(3000);

                // Múltiplos seletores para o campo de input
                const inputSelectors = [
                    'textarea[placeholder*="Message"]',
                    'textarea[data-id="root"]',
                    '#prompt-textarea',
                    'textarea[placeholder*="Send a message"]',
                    'div[contenteditable="true"]',
                    'textarea'
                ];

                let inputElement = null;
                
                // Tenta encontrar o campo de input
                for (const selector of inputSelectors) {
                    try {
                        inputElement = await Utils.waitForElement(selector, 5000);
                        if (inputElement) {
                            Utils.log(`Campo de input encontrado: ${selector}`, 'success');
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!inputElement) {
                    throw new Error('Campo de input não encontrado');
                }

                // Injeta o prompt
                if (inputElement.tagName.toLowerCase() === 'textarea') {
                    inputElement.value = prompt;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    inputElement.textContent = prompt;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                }

                Utils.log('Prompt injetado com sucesso', 'success');
                updateProgress(90);

                // Aguarda um pouco para o botão de envio ficar ativo
                await Utils.sleep(2000);

                // Tenta enviar automaticamente
                const sendSuccess = await this.attemptAutoSend();
                
                if (sendSuccess) {
                    Utils.log('Prompt enviado automaticamente', 'success');
                    updateProgress(100);
                    return true;
                } else {
                    Utils.log('Envio automático falhou, prompt injetado mas não enviado', 'warning');
                    return true; // Ainda considera sucesso pois o prompt foi injetado
                }

            } catch (error) {
                Utils.log(`Erro na injeção de prompt: ${error.message}`, 'error');
                return false;
            }
        },

        /**
         * Tenta enviar o prompt automaticamente
         * @returns {Promise<boolean>}
         */
        attemptAutoSend: async function() {
            try {
                const sendButtonSelectors = [
                    'button[data-testid="send-button"]',
                    'button[aria-label*="Send"]',
                    'button[type="submit"]',
                    'button:has(svg)',
                    '[data-testid="send-button"]'
                ];

                for (const selector of sendButtonSelectors) {
                    const sendButton = document.querySelector(selector);
                    if (sendButton && !sendButton.disabled) {
                        sendButton.click();
                        Utils.log('Botão de envio clicado', 'success');
                        return true;
                    }
                }

                // Tenta usar Enter como fallback
                const inputElement = document.querySelector('textarea, div[contenteditable="true"]');
                if (inputElement) {
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    inputElement.dispatchEvent(enterEvent);
                    Utils.log('Tentativa de envio via Enter', 'info');
                    return true;
                }

                return false;

            } catch (error) {
                Utils.log(`Erro no envio automático: ${error.message}`, 'error');
                return false;
            }
        }
    };

    // Módulo de redirecionamento para redes sociais v5.0
    const SocialNetworkRedirect = {
        /**
         * Redireciona para as redes sociais selecionadas
         * @param {Array} networks - Lista de redes sociais
         * @param {string} message - Mensagem gerada (para redes que suportam)
         * @param {string} user - Usuário (opcional)
         */
        redirectToNetworks: function(networks, message, user) {
            Utils.log(`Redirecionando para redes: ${networks.join(', ')}`);
            updateStatus('🚀 Redirecionando para redes sociais...');

            networks.forEach((network, index) => {
                setTimeout(() => {
                    this.redirectToNetwork(network, message, user);
                }, index * 1000); // Delay de 1s entre cada redirecionamento
            });
        },

        /**
         * Redireciona para uma rede social específica
         * @param {string} network - Nome da rede social
         * @param {string} message - Mensagem
         * @param {string} user - Usuário
         */
        redirectToNetwork: function(network, message, user) {
            const networkConfig = CONFIG.networks[network];
            
            if (!networkConfig) {
                Utils.log(`Rede social não configurada: ${network}`, 'error');
                return;
            }

            let url;
            
            if (user && networkConfig.urlWithUser) {
                url = networkConfig.urlWithUser.replace('{user}', user);
            } else {
                url = networkConfig.urlTemplate;
            }

            // Para redes que suportam injeção de texto
            if (networkConfig.supportsTextInjection && message) {
                url = url.replace('{message}', encodeURIComponent(message));
            }

            Utils.log(`Abrindo ${networkConfig.name}: ${url}`);
            
            try {
                window.open(url, '_blank');
            } catch (error) {
                Utils.log(`Erro ao abrir ${networkConfig.name}: ${error.message}`, 'error');
            }
        }
    };

    // Controlador principal de automação v5.0
    const AutomationController = {
        inactivityTimer: null,
        
        /**
         * Inicia o processo de automação v5.0
         */
        init: async function() {
            try {
                Utils.log('Iniciando Link Mágico v5.0...', 'info');
                updateStatus('🪄 Iniciando Link Mágico v5.0...');
                updateProgress(0);

                const params = Utils.getUrlParams();
                
                // Validação de parâmetros v5.0
                if (!this.validateParams(params)) {
                    return;
                }

                const { robo, pagina, rede, user } = params;
                const networks = rede.split(',');

                Utils.log(`Robô: ${robo}`);
                Utils.log(`Página: ${pagina}`);
                Utils.log(`Redes: ${networks.join(', ')}`);
                if (user) Utils.log(`Usuário: ${user}`);

                updateStepInfo('✅ Parâmetros validados', 'Configuração carregada com sucesso');
                updateProgress(10);

                // Extração de dados da página de vendas
                const pageData = await PageDataExtractor.extractPageData(pagina);
                updateStepInfo('📊 Dados extraídos', `Informações coletadas de: ${pageData.title}`);

                // Geração do prompt inteligente
                const prompt = PromptGenerator.generatePrompt(pageData, robo, networks, user);
                updateStepInfo('🧠 Prompt gerado', 'Prompt personalizado criado com base nos dados extraídos');

                // Se ChatGPT está nas redes selecionadas, injeta o prompt
                if (networks.includes('chatgpt')) {
                    if (ChatGPTAutomation.isChatGPTPage()) {
                        const injectionSuccess = await ChatGPTAutomation.injectPrompt(prompt);
                        
                        if (injectionSuccess) {
                            updateStepInfo('✅ Prompt injetado', 'ChatGPT configurado com sucesso');
                            updateStatus('✅ Automação concluída com sucesso!');
                            showSuccess('ChatGPT configurado e redes sociais abertas!');
                        } else {
                            this.showFallback(prompt);
                            return;
                        }
                    } else {
                        // Redireciona para ChatGPT primeiro
                        updateStatus('🔄 Redirecionando para ChatGPT...');
                        sessionStorage.setItem('linkMagicoPrompt', prompt);
                        sessionStorage.setItem('linkMagicoNetworks', JSON.stringify(networks));
                        sessionStorage.setItem('linkMagicoUser', user || '');
                        
                        setTimeout(() => {
                            window.location.href = CONFIG.chatGPTUrl;
                        }, 2000);
                        return;
                    }
                }

                // Redireciona para outras redes sociais
                const otherNetworks = networks.filter(n => n !== 'chatgpt');
                if (otherNetworks.length > 0) {
                    await Utils.sleep(2000);
                    SocialNetworkRedirect.redirectToNetworks(otherNetworks, '', user);
                }

                updateProgress(100);
                this.startInactivityTimer();

            } catch (error) {
                Utils.log(`Erro na automação: ${error.message}`, 'error');
                showError(`Erro na automação: ${error.message}`);
            }
        },

        /**
         * Valida os parâmetros da URL
         * @param {Object} params - Parâmetros da URL
         * @returns {boolean}
         */
        validateParams: function(params) {
            if (!params.robo) {
                showError('Parâmetro "robo" não encontrado na URL');
                return false;
            }

            if (!params.pagina) {
                showError('Parâmetro "pagina" não encontrado na URL');
                return false;
            }

            if (!params.rede) {
                showError('Parâmetro "rede" não encontrado na URL');
                return false;
            }

            if (!Utils.isValidUrl(params.pagina)) {
                showError('URL da página de vendas inválida');
                return false;
            }

            const robotNameRegex = /^@[a-zA-Z0-9_]+$/;
            if (!robotNameRegex.test(params.robo)) {
                showError('Nome do robô deve começar com @ e conter apenas letras, números e underscores');
                return false;
            }

            return true;
        },

        /**
         * Exibe interface de fallback
         * @param {string} prompt - Prompt gerado
         */
        showFallback: function(prompt) {
            Utils.log('Exibindo interface de fallback', 'warning');
            updateStatus('⚠️ Injeção automática falhou');
            showFallback(prompt);
            this.startInactivityTimer();
        },

        /**
         * Inicia timer de inatividade
         */
        startInactivityTimer: function() {
            if (typeof startInactivityTimer === 'function') {
                startInactivityTimer();
            }
        },

        /**
         * Verifica se há dados salvos na sessão (para retorno do ChatGPT)
         */
        checkSessionData: function() {
            const savedPrompt = sessionStorage.getItem('linkMagicoPrompt');
            const savedNetworks = sessionStorage.getItem('linkMagicoNetworks');
            const savedUser = sessionStorage.getItem('linkMagicoUser');

            if (savedPrompt && savedNetworks && ChatGPTAutomation.isChatGPTPage()) {
                Utils.log('Dados de sessão encontrados, continuando automação...', 'info');
                
                const networks = JSON.parse(savedNetworks);
                const user = savedUser || null;

                // Limpa dados da sessão
                sessionStorage.removeItem('linkMagicoPrompt');
                sessionStorage.removeItem('linkMagicoNetworks');
                sessionStorage.removeItem('linkMagicoUser');

                // Injeta o prompt
                setTimeout(async () => {
                    const injectionSuccess = await ChatGPTAutomation.injectPrompt(savedPrompt);
                    
                    if (injectionSuccess) {
                        updateStatus('✅ Prompt injetado com sucesso!');
                        
                        // Redireciona para outras redes
                        const otherNetworks = networks.filter(n => n !== 'chatgpt');
                        if (otherNetworks.length > 0) {
                            await Utils.sleep(3000);
                            SocialNetworkRedirect.redirectToNetworks(otherNetworks, '', user);
                        }
                        
                        showSuccess('Automação concluída com sucesso!');
                    } else {
                        this.showFallback(savedPrompt);
                    }
                }, 3000);

                return true;
            }

            return false;
        }
    };

    // Inicialização quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Verifica primeiro se há dados de sessão
            if (!AutomationController.checkSessionData()) {
                // Se não há dados de sessão, inicia normalmente
                AutomationController.init();
            }
        });
    } else {
        // Se o DOM já está pronto
        if (!AutomationController.checkSessionData()) {
            AutomationController.init();
        }
    }

    // Exporta o controlador para uso global
    window.AutomationController = AutomationController;

})();

