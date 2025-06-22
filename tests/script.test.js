/**
 * Testes unitários para o script de automação do Link Mágico
 * 
 * @author Manus AI
 * @version 1.0.0
 */

// Importar o script de automação (simulado)
// Como o script é executado em IIFE, vamos criar uma versão testável
const createLinkMagicoScript = () => {
  // Configurações globais (copiadas do script original)
  const CONFIG = {
    chatGPTUrl: 'https://chat.openai.com/',
    defaultMessage: 'Olá! Em que posso ajudar hoje?',
    networks: {
      whatsapp: {
        name: 'WhatsApp',
        urlTemplate: 'https://web.whatsapp.com/send?text={message}',
        icon: '📱'
      },
      instagram: {
        name: 'Instagram DM',
        urlTemplate: 'https://ig.me/m/{user}',
        icon: '📸'
      },
      messenger: {
        name: 'Facebook Messenger',
        urlTemplate: 'https://m.me/{user}',
        icon: '💬'
      },
      tiktok: {
        name: 'TikTok',
        urlTemplate: 'https://www.tiktok.com/@{user}',
        icon: '🎵'
      },
      twitter: {
        name: 'Twitter/X',
        urlTemplate: 'https://twitter.com/messages/compose?recipient_id={user}',
        icon: '🐦'
      },
      kwai: {
        name: 'Kwai',
        urlTemplate: 'https://www.kwai.com/@{user}',
        icon: '🎬'
      }
    }
  };

  // Utilitários (versão testável)
  const Utils = {
    getUrlParams: function() {
      const params = new URLSearchParams(window.location.search);
      return {
        rede: params.get('rede'),
        user: params.get('user')
      };
    },

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

    showOverlay: function(message, type = 'info') {
      const existingOverlay = document.getElementById('linkMagicoOverlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      const overlay = document.createElement('div');
      overlay.id = 'linkMagicoOverlay';
      overlay.textContent = message;
      overlay.setAttribute('data-type', type);
      document.body.appendChild(overlay);
      
      return overlay;
    },

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
    }
  };

  // Módulo de redirecionamento para redes sociais (versão testável)
  const SocialNetworkRedirect = {
    redirectToWhatsApp: function(message, user) {
      const encodedMessage = encodeURIComponent(message);
      let url = CONFIG.networks.whatsapp.urlTemplate.replace('{message}', encodedMessage);
      
      if (user && user.match(/^\d+$/)) {
        url = `https://wa.me/${user}?text=${encodedMessage}`;
      }
      
      window.open(url, '_blank');
      return url;
    },

    redirectToInstagram: function(message, user) {
      let url = 'https://www.instagram.com/direct/inbox/';
      
      if (user) {
        url = CONFIG.networks.instagram.urlTemplate.replace('{user}', user);
      }
      
      window.open(url, '_blank');
      return url;
    },

    redirectToMessenger: function(message, user) {
      let url = 'https://www.messenger.com/';
      
      if (user) {
        url = CONFIG.networks.messenger.urlTemplate.replace('{user}', user);
      }
      
      window.open(url, '_blank');
      return url;
    },

    redirectToTikTok: function(message, user) {
      let url = 'https://www.tiktok.com/';
      
      if (user) {
        url = CONFIG.networks.tiktok.urlTemplate.replace('{user}', user);
      }
      
      window.open(url, '_blank');
      return url;
    },

    redirectToTwitter: function(message, user) {
      let url = 'https://twitter.com/messages';
      
      if (user) {
        url = CONFIG.networks.twitter.urlTemplate.replace('{user}', user);
      }
      
      window.open(url, '_blank');
      return url;
    },

    redirectToKwai: function(message, user) {
      let url = 'https://www.kwai.com/';
      
      if (user) {
        url = CONFIG.networks.kwai.urlTemplate.replace('{user}', user);
      }
      
      window.open(url, '_blank');
      return url;
    }
  };

  return {
    CONFIG,
    Utils,
    SocialNetworkRedirect
  };
};

describe('Link Mágico - Testes Unitários', () => {
  let linkMagico;

  beforeEach(() => {
    linkMagico = createLinkMagicoScript();
  });

  describe('Configurações', () => {
    test('deve ter todas as redes sociais configuradas', () => {
      const networks = linkMagico.CONFIG.networks;
      
      expect(networks).toHaveProperty('whatsapp');
      expect(networks).toHaveProperty('instagram');
      expect(networks).toHaveProperty('messenger');
      expect(networks).toHaveProperty('tiktok');
      expect(networks).toHaveProperty('twitter');
      expect(networks).toHaveProperty('kwai');
    });

    test('cada rede social deve ter propriedades obrigatórias', () => {
      const networks = linkMagico.CONFIG.networks;
      
      Object.values(networks).forEach(network => {
        expect(network).toHaveProperty('name');
        expect(network).toHaveProperty('urlTemplate');
        expect(network).toHaveProperty('icon');
        expect(typeof network.name).toBe('string');
        expect(typeof network.urlTemplate).toBe('string');
        expect(typeof network.icon).toBe('string');
      });
    });

    test('deve ter mensagem padrão configurada', () => {
      expect(linkMagico.CONFIG.defaultMessage).toBeDefined();
      expect(typeof linkMagico.CONFIG.defaultMessage).toBe('string');
      expect(linkMagico.CONFIG.defaultMessage.length).toBeGreaterThan(0);
    });

    test('deve ter URL do ChatGPT configurada', () => {
      expect(linkMagico.CONFIG.chatGPTUrl).toBe('https://chat.openai.com/');
    });
  });

  describe('Utils.getUrlParams', () => {
    test('deve extrair parâmetros da URL corretamente', () => {
      window.location.search = '?rede=whatsapp&user=teste';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.rede).toBe('whatsapp');
      expect(params.user).toBe('teste');
    });

    test('deve retornar null para parâmetros inexistentes', () => {
      window.location.search = '';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.rede).toBeNull();
      expect(params.user).toBeNull();
    });

    test('deve lidar com múltiplas redes', () => {
      window.location.search = '?rede=whatsapp,instagram,messenger&user=teste';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.rede).toBe('whatsapp,instagram,messenger');
      expect(params.user).toBe('teste');
    });

    test('deve decodificar caracteres especiais na URL', () => {
      window.location.search = '?rede=whatsapp&user=test%40user';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.user).toBe('test@user');
    });
  });

  describe('Utils.log', () => {
    test('deve fazer log de mensagens info por padrão', () => {
      linkMagico.Utils.log('Teste de mensagem');
      
      expect(console.log).toHaveBeenCalled();
      expect(console.log.mock.calls[0][1]).toContain('Teste de mensagem');
    });

    test('deve fazer log de erros corretamente', () => {
      linkMagico.Utils.log('Erro de teste', 'error');
      
      expect(console.error).toHaveBeenCalled();
      expect(console.error.mock.calls[0][1]).toContain('Erro de teste');
    });

    test('deve fazer log de sucesso com estilo', () => {
      linkMagico.Utils.log('Sucesso de teste', 'success');
      
      expect(console.log).toHaveBeenCalled();
      expect(console.log.mock.calls[0][0]).toContain('color: green');
    });

    test('deve incluir timestamp nas mensagens', () => {
      linkMagico.Utils.log('Teste com timestamp');
      
      expect(console.log).toHaveBeenCalled();
      expect(console.log.mock.calls[0][0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    });
  });

  describe('Utils.showOverlay', () => {
    test('deve criar overlay com mensagem', () => {
      const overlay = linkMagico.Utils.showOverlay('Teste de overlay');
      
      expect(overlay).toBeDefined();
      expect(overlay.id).toBe('linkMagicoOverlay');
      expect(overlay.textContent).toBe('Teste de overlay');
      expect(document.body.contains(overlay)).toBe(true);
    });

    test('deve remover overlay existente antes de criar novo', () => {
      const overlay1 = linkMagico.Utils.showOverlay('Primeiro overlay');
      const overlay2 = linkMagico.Utils.showOverlay('Segundo overlay');
      
      expect(document.body.contains(overlay1)).toBe(false);
      expect(document.body.contains(overlay2)).toBe(true);
      expect(document.querySelectorAll('#linkMagicoOverlay')).toHaveLength(1);
    });

    test('deve definir tipo do overlay corretamente', () => {
      const overlay = linkMagico.Utils.showOverlay('Teste de erro', 'error');
      
      expect(overlay.getAttribute('data-type')).toBe('error');
    });
  });

  describe('Utils.waitForElement', () => {
    test('deve resolver imediatamente se elemento já existe', async () => {
      const testElement = document.createElement('div');
      testElement.id = 'test-element';
      document.body.appendChild(testElement);
      
      const result = await linkMagico.Utils.waitForElement('#test-element');
      
      expect(result).toBe(testElement);
    });

    test('deve rejeitar após timeout se elemento não for encontrado', async () => {
      await expect(
        linkMagico.Utils.waitForElement('#elemento-inexistente', 100)
      ).rejects.toThrow('Elemento #elemento-inexistente não encontrado após 100ms');
    });
  });

  describe('SocialNetworkRedirect', () => {
    beforeEach(() => {
      window.open.mockClear();
    });

    describe('redirectToWhatsApp', () => {
      test('deve gerar URL correta para WhatsApp Web', () => {
        const message = 'Olá! Como posso ajudar?';
        const url = linkMagico.SocialNetworkRedirect.redirectToWhatsApp(message);
        
        expect(url).toContain('web.whatsapp.com/send');
        expect(url).toContain(encodeURIComponent(message));
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });

      test('deve usar wa.me para números de telefone', () => {
        const message = 'Teste';
        const user = '5511999999999';
        const url = linkMagico.SocialNetworkRedirect.redirectToWhatsApp(message, user);
        
        expect(url).toContain('wa.me/5511999999999');
        expect(url).toContain(encodeURIComponent(message));
      });

      test('deve codificar caracteres especiais na mensagem', () => {
        const message = 'Olá! Como está? 😊';
        const url = linkMagico.SocialNetworkRedirect.redirectToWhatsApp(message);
        
        expect(url).toContain(encodeURIComponent(message));
      });
    });

    describe('redirectToInstagram', () => {
      test('deve gerar URL correta para Instagram DM', () => {
        const user = 'usuario_teste';
        const url = linkMagico.SocialNetworkRedirect.redirectToInstagram('', user);
        
        expect(url).toContain('ig.me/m/usuario_teste');
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });

      test('deve usar URL padrão quando não há usuário', () => {
        const url = linkMagico.SocialNetworkRedirect.redirectToInstagram('');
        
        expect(url).toBe('https://www.instagram.com/direct/inbox/');
      });
    });

    describe('redirectToMessenger', () => {
      test('deve gerar URL correta para Messenger', () => {
        const user = 'usuario.teste';
        const url = linkMagico.SocialNetworkRedirect.redirectToMessenger('', user);
        
        expect(url).toContain('m.me/usuario.teste');
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });

      test('deve usar URL padrão quando não há usuário', () => {
        const url = linkMagico.SocialNetworkRedirect.redirectToMessenger('');
        
        expect(url).toBe('https://www.messenger.com/');
      });
    });

    describe('redirectToTikTok', () => {
      test('deve gerar URL correta para TikTok', () => {
        const user = 'usuario_tiktok';
        const url = linkMagico.SocialNetworkRedirect.redirectToTikTok('', user);
        
        expect(url).toContain('tiktok.com/@usuario_tiktok');
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });
    });

    describe('redirectToTwitter', () => {
      test('deve gerar URL correta para Twitter/X', () => {
        const user = 'usuario_twitter';
        const url = linkMagico.SocialNetworkRedirect.redirectToTwitter('', user);
        
        expect(url).toContain('twitter.com/messages/compose');
        expect(url).toContain('recipient_id=usuario_twitter');
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });
    });

    describe('redirectToKwai', () => {
      test('deve gerar URL correta para Kwai', () => {
        const user = 'usuario_kwai';
        const url = linkMagico.SocialNetworkRedirect.redirectToKwai('', user);
        
        expect(url).toContain('kwai.com/@usuario_kwai');
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });
    });
  });

  describe('Integração - Fluxo Completo', () => {
    test('deve processar parâmetros e redirecionar corretamente', () => {
      window.location.search = '?rede=whatsapp&user=5511999999999';
      
      const params = linkMagico.Utils.getUrlParams();
      expect(params.rede).toBe('whatsapp');
      expect(params.user).toBe('5511999999999');
      
      const url = linkMagico.SocialNetworkRedirect.redirectToWhatsApp(
        linkMagico.CONFIG.defaultMessage, 
        params.user
      );
      
      expect(url).toContain('wa.me/5511999999999');
      expect(url).toContain(encodeURIComponent(linkMagico.CONFIG.defaultMessage));
    });

    test('deve lidar com múltiplas redes sociais', () => {
      window.location.search = '?rede=whatsapp,instagram&user=teste';
      
      const params = linkMagico.Utils.getUrlParams();
      const redes = params.rede.split(',');
      
      expect(redes).toContain('whatsapp');
      expect(redes).toContain('instagram');
      
      // Simula redirecionamento para cada rede
      redes.forEach(rede => {
        switch(rede) {
          case 'whatsapp':
            linkMagico.SocialNetworkRedirect.redirectToWhatsApp('', params.user);
            break;
          case 'instagram':
            linkMagico.SocialNetworkRedirect.redirectToInstagram('', params.user);
            break;
        }
      });
      
      expect(window.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('Tratamento de Erros', () => {
    test('deve lidar com URLs malformadas', () => {
      window.location.search = '?rede=&user=';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.rede).toBe('');
      expect(params.user).toBe('');
    });

    test('deve lidar com caracteres especiais em parâmetros', () => {
      window.location.search = '?rede=whatsapp&user=test%20user%40domain.com';
      
      const params = linkMagico.Utils.getUrlParams();
      
      expect(params.user).toBe('test user@domain.com');
    });

    test('deve funcionar mesmo sem parâmetros', () => {
      window.location.search = '';
      
      expect(() => {
        linkMagico.Utils.getUrlParams();
      }).not.toThrow();
    });
  });
});

