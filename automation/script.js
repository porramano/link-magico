/**
 * Link Mágico v5.0 - Script de Automação Inteligente
 * Extração de dados, injeção de prompts e automação para redes sociais
 * 
 * @author Manus AI
 * @version 5.0.1
 * @domain arsenalsecretodosceos.com.br
 */

(function() {
    'use strict';

    // Configurações globais v5.0.1
    const CONFIG = {
        version: '5.0.1',
        domain: 'arsenalsecretodosceos.com.br',
        chatGPTUrl: 'https://chat.openai.com/',
        corsProxy: 'https://api.allorigins.win/get?url=',
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
                urlWithUser: 'https://chat.openai.com/',
                icon: '🤖',
                supportsTextInjection: true
            }
        }
    };

    // Estado global da aplicação
    let appState = {
        robo: '',
        pagina: '',
        redes: [],
        user: '',
        extractedData: null,
        generatedPrompt: '',
        isProcessing: false
    };

    // Utilitários de logging
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] Link Mágico v${CONFIG.version}:`;
        
        if (type === 'error') {
            console.error(`${prefix} ${message}`);
        } else if (type === 'warn') {
            console.warn(`${prefix} ${message}`);
        } else if (type === 'success') {
            console.log(`%c${prefix} ${message}`, 'color: green; font-weight: bold;');
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    // Função para extrair parâmetros da URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            robo: params.get('robo') || '',
            pagina: params.get('pagina') || '',
            rede: params.get('rede') || '',
            user: params.get('user') || ''
        };
    }

    // Função para validar parâmetros
    function validateParams(params) {
        const errors = [];

        if (!params.robo || !params.robo.startsWith('@')) {
            errors.push('Nome do robô deve começar com @ (ex: @vendas_bot)');
        }

        if (!params.pagina || !isValidUrl(params.pagina)) {
            errors.push('URL da página de vendas é obrigatória e deve ser válida');
        }

        if (!params.rede) {
            errors.push('Pelo menos uma rede social deve ser selecionada');
        }

        return errors;
    }

    // Função para validar URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Função para extrair dados da página de vendas
    async function extractPageData(url) {
        try {
            log(`Extraindo dados da página: ${url}`);
            
            const proxyUrl = `${CONFIG.corsProxy}${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const html = data.contents;
            
            // Criar um parser DOM temporário
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extrair dados estruturados
            const extractedData = {
                title: extractTitle(doc),
                description: extractDescription(doc),
                price: extractPrice(doc),
                benefits: extractBenefits(doc),
                testimonials: extractTestimonials(doc),
                cta: extractCTA(doc)
            };
            
            log('Dados extraídos com sucesso', 'success');
            return extractedData;
            
        } catch (error) {
            log(`Erro na extração: ${error.message}`, 'warn');
            return getDefaultData();
        }
    }

    // Funções auxiliares de extração
    function extractTitle(doc) {
        const selectors = [
            'h1',
            '.title',
            '.product-title',
            '.headline',
            'title'
        ];
        
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'Produto/Serviço Exclusivo';
    }

    function extractDescription(doc) {
        const selectors = [
            '.description',
            '.product-description',
            '.summary',
            'meta[name="description"]',
            'p'
        ];
        
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element) {
                const text = selector.includes('meta') 
                    ? element.getAttribute('content') 
                    : element.textContent;
                if (text && text.trim().length > 50) {
                    return text.trim();
                }
            }
        }
        
        return 'Solução completa para suas necessidades. Descubra como transformar seus resultados com nossa metodologia exclusiva.';
    }

    function extractPrice(doc) {
        const selectors = [
            '.price',
            '.valor',
            '.preco',
            '[class*="price"]',
            '[class*="valor"]'
        ];
        
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.match(/R\$|USD|\$|€/)) {
                return element.textContent.trim();
            }
        }
        
        return null;
    }

    function extractBenefits(doc) {
        const benefits = [];
        const selectors = [
            '.benefits li',
            '.vantagens li',
            '.features li',
            'ul li',
            '.benefit'
        ];
        
        for (const selector of selectors) {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 10 && text.length < 200) {
                    benefits.push(text);
                }
            });
            
            if (benefits.length >= 3) break;
        }
        
        return benefits.length > 0 ? benefits : [
            'Resultados comprovados',
            'Suporte especializado',
            'Metodologia exclusiva'
        ];
    }

    function extractTestimonials(doc) {
        const testimonials = [];
        const selectors = [
            '.testimonial',
            '.depoimento',
            '.review',
            '.feedback'
        ];
        
        for (const selector of selectors) {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 20 && text.length < 500) {
                    testimonials.push(text);
                }
            });
            
            if (testimonials.length >= 2) break;
        }
        
        return testimonials;
    }

    function extractCTA(doc) {
        const selectors = [
            '.cta',
            '.btn-primary',
            '.button',
            'button',
            '.comprar',
            '.buy-now'
        ];
        
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'Quero saber mais!';
    }

    // Dados padrão em caso de falha na extração
    function getDefaultData() {
        return {
            title: 'Produto/Serviço Exclusivo',
            description: 'Solução completa para suas necessidades. Descubra como transformar seus resultados com nossa metodologia exclusiva.',
            price: null,
            benefits: [
                'Resultados comprovados',
                'Suporte especializado',
                'Metodologia exclusiva'
            ],
            testimonials: [],
            cta: 'Quero saber mais!'
        };
    }

    // Função para gerar prompt personalizado
    function generatePrompt(robo, extractedData, redes, user) {
        log('Gerando prompt personalizado...');
        
        const redesText = redes.map(rede => CONFIG.networks[rede]?.name || rede).join(', ');
        
        let prompt = `Você é ${robo}, um assistente virtual especializado em vendas e atendimento ao cliente.\n\n`;
        
        prompt += `INFORMAÇÕES DO PRODUTO/SERVIÇO:\n`;
        prompt += `• Nome: ${extractedData.title}\n`;
        prompt += `• Descrição: ${extractedData.description}\n`;
        
        if (extractedData.price) {
            prompt += `• Preço: ${extractedData.price}\n`;
        }
        
        prompt += `\nPRINCIPAIS BENEFÍCIOS:\n`;
        extractedData.benefits.forEach((benefit, index) => {
            prompt += `${index + 1}. ${benefit}\n`;
        });
        
        if (extractedData.testimonials.length > 0) {
            prompt += `\nDEPOIMENTOS DE CLIENTES:\n`;
            extractedData.testimonials.forEach((testimonial, index) => {
                prompt += `${index + 1}. "${testimonial}"\n`;
            });
        }
        
        prompt += `\nCONTEXTO DE ATENDIMENTO:\n`;
        prompt += `• Redes sociais ativas: ${redesText}\n`;
        if (user) {
            prompt += `• Usuário/Perfil: ${user}\n`;
        }
        
        prompt += `\nINSTRUÇÕES DE COMPORTAMENTO:\n`;
        prompt += `1. Seja sempre cordial, profissional e prestativo\n`;
        prompt += `2. Responda de forma clara e objetiva\n`;
        prompt += `3. Foque nos benefícios e resultados para o cliente\n`;
        prompt += `4. Use as informações do produto para responder dúvidas\n`;
        prompt += `5. Conduza a conversa naturalmente para o fechamento\n`;
        prompt += `6. Se não souber algo específico, seja honesto e ofereça contato direto\n`;
        prompt += `7. Mantenha um tom amigável e consultivo\n`;
        prompt += `8. Use emojis moderadamente para humanizar a conversa\n\n`;
        
        prompt += `Agora você está pronto para atender! Responda sempre como ${robo} e ajude os clientes da melhor forma possível.`;
        
        log('Prompt gerado com sucesso', 'success');
        return prompt;
    }

    // Função para gerar URL da rede social
    function generateNetworkUrl(network, user, message = '') {
        const config = CONFIG.networks[network];
        if (!config) return null;
        
        let url;
        if (user && config.urlWithUser) {
            url = config.urlWithUser.replace('{user}', encodeURIComponent(user));
        } else {
            url = config.urlTemplate;
        }
        
        if (message && config.supportsTextInjection) {
            url = url.replace('{message}', encodeURIComponent(message));
        }
        
        return url;
    }

    // Função para atualizar a interface
    function updateInterface(status, data = {}) {
        const statusElement = document.getElementById('status');
        const progressElement = document.getElementById('progress');
        const promptSection = document.getElementById('prompt-section');
        const promptText = document.getElementById('prompt-text');
        const networksSection = document.getElementById('networks-section');
        const timerElement = document.getElementById('timer');

        if (statusElement) {
            statusElement.textContent = status;
        }

        if (progressElement) {
            progressElement.style.width = `${data.progress || 0}%`;
        }

        if (data.prompt && promptText) {
            promptText.textContent = data.prompt;
            if (promptSection) {
                promptSection.style.display = 'block';
            }
        }

        if (data.showNetworks && networksSection) {
            networksSection.style.display = 'block';
        }

        if (timerElement && data.timer !== undefined) {
            if (data.timer > 0) {
                timerElement.textContent = `Encerrando em: ${data.timer}s`;
                timerElement.style.display = 'block';
            } else {
                timerElement.style.display = 'none';
            }
        }
    }

    // Função para criar botões de redes sociais
    function createNetworkButtons(redes, user, prompt) {
        const container = document.getElementById('network-buttons');
        if (!container) return;

        container.innerHTML = '';

        redes.forEach((rede, index) => {
            const config = CONFIG.networks[rede];
            if (!config) return;

            const button = document.createElement('button');
            button.className = 'network-button';
            button.innerHTML = `${config.icon} ${config.name}`;
            
            const url = generateNetworkUrl(rede, user, config.supportsTextInjection ? prompt : '');
            
            button.onclick = () => {
                log(`Abrindo ${config.name}: ${url}`);
                window.open(url, '_blank');
            };

            container.appendChild(button);
        });
    }

    // Função para copiar prompt
    function copyPrompt() {
        const promptText = document.getElementById('prompt-text');
        if (!promptText) return;

        navigator.clipboard.writeText(promptText.textContent).then(() => {
            log('Prompt copiado para a área de transferência', 'success');
            
            // Feedback visual
            const copyBtn = document.getElementById('copy-prompt-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copiado!';
                copyBtn.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = '';
                }, 2000);
            }
        }).catch(err => {
            log('Erro ao copiar prompt: ' + err.message, 'error');
        });
    }

    // Função principal de automação
    async function runAutomation() {
        if (appState.isProcessing) return;
        appState.isProcessing = true;

        try {
            log(`Iniciando Link Mágico v${CONFIG.version}...`);
            
            // Obter parâmetros da URL
            const params = getUrlParams();
            log(`Robô: ${params.robo}`);
            log(`Página: ${params.pagina}`);
            log(`Redes: ${params.rede}`);
            log(`Usuário: ${params.user}`);

            // Validar parâmetros
            const errors = validateParams(params);
            if (errors.length > 0) {
                throw new Error(errors.join('; '));
            }

            // Atualizar estado
            appState.robo = params.robo;
            appState.pagina = params.pagina;
            appState.redes = params.rede.split(',').map(r => r.trim());
            appState.user = params.user;

            // Atualizar interface - Iniciando
            updateInterface('🔍 Extraindo dados da página...', { progress: 20 });

            // Extrair dados da página
            appState.extractedData = await extractPageData(params.pagina);
            
            // Atualizar interface - Dados extraídos
            updateInterface('🧠 Gerando prompt personalizado...', { progress: 60 });

            // Gerar prompt
            appState.generatedPrompt = generatePrompt(
                appState.robo, 
                appState.extractedData, 
                appState.redes, 
                appState.user
            );

            // Atualizar interface - Prompt gerado
            updateInterface('✅ Prompt gerado com sucesso!', { 
                progress: 100, 
                prompt: appState.generatedPrompt,
                showNetworks: true
            });

            // Criar botões para redes sociais
            createNetworkButtons(appState.redes, appState.user, appState.generatedPrompt);

            // Redirecionamento direto para a primeira rede social
            if (appState.redes.length > 0) {
                const firstNetwork = appState.redes[0];
                const firstUrl = generateNetworkUrl(firstNetwork, appState.user, 
                    CONFIG.networks[firstNetwork]?.supportsTextInjection ? appState.generatedPrompt : '');
                
                if (firstUrl) {
                    log(`Redirecionando para ${CONFIG.networks[firstNetwork]?.name}: ${firstUrl}`);
                    
                    // Aguardar um pouco para o usuário ver a interface
                    setTimeout(() => {
                        window.location.href = firstUrl;
                    }, 3000);
                }
            }

        } catch (error) {
            log(`Erro na automação: ${error.message}`, 'error');
            updateInterface(`❌ Erro: ${error.message}`, { progress: 0 });
        } finally {
            appState.isProcessing = false;
        }
    }

    // Função para tentar injeção no ChatGPT (se estiver na lista de redes)
    async function tryInjectChatGPT() {
        if (!appState.redes.includes('chatgpt') || !appState.generatedPrompt) {
            return;
        }

        try {
            log('Tentando injetar prompt no ChatGPT...');
            
            // Seletores possíveis para o campo de input do ChatGPT
            const selectors = [
                '#prompt-textarea',
                'textarea[placeholder*="Message"]',
                'textarea[placeholder*="mensagem"]',
                'textarea[data-id="root"]',
                '.ProseMirror',
                '[contenteditable="true"]'
            ];

            let inputElement = null;
            for (const selector of selectors) {
                inputElement = document.querySelector(selector);
                if (inputElement) break;
            }

            if (inputElement) {
                // Injetar o prompt
                if (inputElement.tagName === 'TEXTAREA') {
                    inputElement.value = appState.generatedPrompt;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    inputElement.textContent = appState.generatedPrompt;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                }

                log('Prompt injetado no ChatGPT com sucesso', 'success');

                // Tentar enviar automaticamente
                setTimeout(() => {
                    const sendSelectors = [
                        'button[data-testid="send-button"]',
                        'button[aria-label*="Send"]',
                        'button[aria-label*="Enviar"]',
                        '.btn-primary',
                        '[data-testid="fruitjuice-send-button"]'
                    ];

                    for (const selector of sendSelectors) {
                        const sendButton = document.querySelector(selector);
                        if (sendButton && !sendButton.disabled) {
                            sendButton.click();
                            log('Prompt enviado automaticamente', 'success');
                            break;
                        }
                    }
                }, 1000);

            } else {
                log('Campo de input do ChatGPT não encontrado', 'warn');
            }

        } catch (error) {
            log(`Erro na injeção do ChatGPT: ${error.message}`, 'error');
        }
    }

    // Inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        log(`Link Mágico v${CONFIG.version} carregado`);
        
        // Configurar botão de copiar prompt
        const copyBtn = document.getElementById('copy-prompt-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', copyPrompt);
        }

        // Verificar se estamos na página do ChatGPT
        if (window.location.hostname.includes('chat.openai.com')) {
            // Aguardar carregamento da página do ChatGPT
            setTimeout(tryInjectChatGPT, 3000);
        } else {
            // Executar automação normal
            runAutomation();
        }
    });

    // Expor funções globais para debugging
    window.LinkMagico = {
        version: CONFIG.version,
        state: appState,
        runAutomation,
        copyPrompt,
        log
    };

})();

