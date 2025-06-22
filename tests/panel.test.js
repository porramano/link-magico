/**
 * Testes unitários para o painel web do Link Mágico
 * 
 * @author Manus AI
 * @version 1.0.0
 */

describe('Painel Web - Testes de Interface', () => {
  let panelHTML;

  beforeEach(() => {
    // Simula o HTML do painel
    document.body.innerHTML = `
      <div class="container">
        <h1>Link Mágico</h1>
        <form id="linkForm">
          <div class="networks">
            <label>
              <input type="checkbox" name="network" value="whatsapp" id="whatsapp">
              <span>📱 WhatsApp</span>
            </label>
            <label>
              <input type="checkbox" name="network" value="instagram" id="instagram">
              <span>📸 Instagram DM</span>
            </label>
            <label>
              <input type="checkbox" name="network" value="messenger" id="messenger">
              <span>💬 Facebook Messenger</span>
            </label>
            <label>
              <input type="checkbox" name="network" value="tiktok" id="tiktok">
              <span>🎵 TikTok</span>
            </label>
            <label>
              <input type="checkbox" name="network" value="twitter" id="twitter">
              <span>🐦 Twitter/X</span>
            </label>
            <label>
              <input type="checkbox" name="network" value="kwai" id="kwai">
              <span>🎬 Kwai</span>
            </label>
          </div>
          
          <div class="user-input">
            <label for="username">Nome de usuário (opcional):</label>
            <input type="text" id="username" name="username" placeholder="Ex: meuusuario">
          </div>
          
          <button type="submit" id="generateBtn">✨ Gerar Link Mágico</button>
        </form>
        
        <div id="result" class="result hidden">
          <h3>Seu Link Mágico:</h3>
          <div class="link-container">
            <input type="text" id="generatedLink" readonly>
            <button id="copyBtn">📋 Copiar Link</button>
          </div>
        </div>
        
        <div id="error" class="error hidden"></div>
      </div>
    `;

    // Simula as funções JavaScript do painel
    window.LinkMagicoPanel = {
      baseUrl: 'https://test-panel.vercel.app',
      
      validateForm: function() {
        const selectedNetworks = document.querySelectorAll('input[name="network"]:checked');
        return selectedNetworks.length > 0;
      },
      
      getSelectedNetworks: function() {
        const selectedNetworks = document.querySelectorAll('input[name="network"]:checked');
        return Array.from(selectedNetworks).map(input => input.value);
      },
      
      getUsername: function() {
        const usernameInput = document.getElementById('username');
        return usernameInput.value.trim();
      },
      
      generateLink: function() {
        if (!this.validateForm()) {
          this.showError('Por favor, selecione pelo menos uma rede social.');
          return null;
        }
        
        const networks = this.getSelectedNetworks();
        const username = this.getUsername();
        
        let link = `${this.baseUrl}/iniciar?rede=${networks.join(',')}`;
        
        if (username) {
          link += `&user=${encodeURIComponent(username)}`;
        }
        
        return link;
      },
      
      showError: function(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 5000);
      },
      
      showResult: function(link) {
        const resultDiv = document.getElementById('result');
        const linkInput = document.getElementById('generatedLink');
        
        linkInput.value = link;
        resultDiv.classList.remove('hidden');
      },
      
      copyToClipboard: function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text);
        } else {
          // Fallback para navegadores mais antigos
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve();
        }
      },
      
      init: function() {
        const form = document.getElementById('linkForm');
        const copyBtn = document.getElementById('copyBtn');
        
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const link = this.generateLink();
          if (link) {
            this.showResult(link);
          }
        });
        
        copyBtn.addEventListener('click', () => {
          const linkInput = document.getElementById('generatedLink');
          this.copyToClipboard(linkInput.value).then(() => {
            copyBtn.textContent = '✅ Copiado!';
            setTimeout(() => {
              copyBtn.textContent = '📋 Copiar Link';
            }, 2000);
          });
        });
      }
    };
  });

  describe('Validação de Formulário', () => {
    test('deve validar que pelo menos uma rede social foi selecionada', () => {
      expect(window.LinkMagicoPanel.validateForm()).toBe(false);
      
      document.getElementById('whatsapp').checked = true;
      expect(window.LinkMagicoPanel.validateForm()).toBe(true);
    });

    test('deve permitir múltiplas redes sociais selecionadas', () => {
      document.getElementById('whatsapp').checked = true;
      document.getElementById('instagram').checked = true;
      document.getElementById('messenger').checked = true;
      
      expect(window.LinkMagicoPanel.validateForm()).toBe(true);
    });
  });

  describe('Obtenção de Redes Selecionadas', () => {
    test('deve retornar array vazio quando nenhuma rede está selecionada', () => {
      const networks = window.LinkMagicoPanel.getSelectedNetworks();
      expect(networks).toEqual([]);
    });

    test('deve retornar redes selecionadas corretamente', () => {
      document.getElementById('whatsapp').checked = true;
      document.getElementById('instagram').checked = true;
      
      const networks = window.LinkMagicoPanel.getSelectedNetworks();
      expect(networks).toEqual(['whatsapp', 'instagram']);
    });

    test('deve incluir todas as redes quando todas estão selecionadas', () => {
      const allNetworks = ['whatsapp', 'instagram', 'messenger', 'tiktok', 'twitter', 'kwai'];
      
      allNetworks.forEach(network => {
        document.getElementById(network).checked = true;
      });
      
      const networks = window.LinkMagicoPanel.getSelectedNetworks();
      expect(networks).toEqual(allNetworks);
    });
  });

  describe('Obtenção de Nome de Usuário', () => {
    test('deve retornar string vazia quando campo está vazio', () => {
      const username = window.LinkMagicoPanel.getUsername();
      expect(username).toBe('');
    });

    test('deve retornar nome de usuário inserido', () => {
      document.getElementById('username').value = 'meuusuario';
      
      const username = window.LinkMagicoPanel.getUsername();
      expect(username).toBe('meuusuario');
    });

    test('deve remover espaços em branco do início e fim', () => {
      document.getElementById('username').value = '  usuario_teste  ';
      
      const username = window.LinkMagicoPanel.getUsername();
      expect(username).toBe('usuario_teste');
    });
  });

  describe('Geração de Links', () => {
    beforeEach(() => {
      // Limpa erros anteriores
      document.getElementById('error').classList.add('hidden');
    });

    test('deve gerar link básico com uma rede social', () => {
      document.getElementById('whatsapp').checked = true;
      
      const link = window.LinkMagicoPanel.generateLink();
      
      expect(link).toBe('https://test-panel.vercel.app/iniciar?rede=whatsapp');
    });

    test('deve gerar link com múltiplas redes sociais', () => {
      document.getElementById('whatsapp').checked = true;
      document.getElementById('instagram').checked = true;
      document.getElementById('messenger').checked = true;
      
      const link = window.LinkMagicoPanel.generateLink();
      
      expect(link).toBe('https://test-panel.vercel.app/iniciar?rede=whatsapp,instagram,messenger');
    });

    test('deve incluir nome de usuário quando fornecido', () => {
      document.getElementById('whatsapp').checked = true;
      document.getElementById('username').value = 'meuusuario';
      
      const link = window.LinkMagicoPanel.generateLink();
      
      expect(link).toBe('https://test-panel.vercel.app/iniciar?rede=whatsapp&user=meuusuario');
    });

    test('deve codificar caracteres especiais no nome de usuário', () => {
      document.getElementById('whatsapp').checked = true;
      document.getElementById('username').value = 'user@domain.com';
      
      const link = window.LinkMagicoPanel.generateLink();
      
      expect(link).toContain('user%40domain.com');
    });

    test('deve retornar null e mostrar erro quando nenhuma rede está selecionada', () => {
      const link = window.LinkMagicoPanel.generateLink();
      
      expect(link).toBeNull();
      expect(document.getElementById('error').classList.contains('hidden')).toBe(false);
      expect(document.getElementById('error').textContent).toContain('selecione pelo menos uma rede social');
    });
  });

  describe('Exibição de Erros', () => {
    test('deve mostrar mensagem de erro', () => {
      window.LinkMagicoPanel.showError('Erro de teste');
      
      const errorDiv = document.getElementById('error');
      expect(errorDiv.classList.contains('hidden')).toBe(false);
      expect(errorDiv.textContent).toBe('Erro de teste');
    });

    test('deve ocultar erro automaticamente após 5 segundos', (done) => {
      window.LinkMagicoPanel.showError('Erro temporário');
      
      const errorDiv = document.getElementById('error');
      expect(errorDiv.classList.contains('hidden')).toBe(false);
      
      setTimeout(() => {
        expect(errorDiv.classList.contains('hidden')).toBe(true);
        done();
      }, 5100);
    }, 6000);
  });

  describe('Exibição de Resultados', () => {
    test('deve mostrar link gerado na interface', () => {
      const testLink = 'https://test.com/link';
      
      window.LinkMagicoPanel.showResult(testLink);
      
      const resultDiv = document.getElementById('result');
      const linkInput = document.getElementById('generatedLink');
      
      expect(resultDiv.classList.contains('hidden')).toBe(false);
      expect(linkInput.value).toBe(testLink);
    });
  });

  describe('Funcionalidade de Cópia', () => {
    test('deve copiar texto para área de transferência', async () => {
      const testText = 'https://test.com/link';
      
      await window.LinkMagicoPanel.copyToClipboard(testText);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    });

    test('deve usar fallback quando clipboard API não está disponível', async () => {
      // Simula ausência da clipboard API
      const originalClipboard = navigator.clipboard;
      delete navigator.clipboard;
      
      // Mock do document.execCommand
      document.execCommand = jest.fn().mockReturnValue(true);
      
      const testText = 'https://test.com/link';
      await window.LinkMagicoPanel.copyToClipboard(testText);
      
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      
      // Restaura clipboard original
      navigator.clipboard = originalClipboard;
    });
  });

  describe('Inicialização do Painel', () => {
    test('deve configurar event listeners corretamente', () => {
      const form = document.getElementById('linkForm');
      const copyBtn = document.getElementById('copyBtn');
      
      // Spy nos métodos
      const generateLinkSpy = jest.spyOn(window.LinkMagicoPanel, 'generateLink');
      const showResultSpy = jest.spyOn(window.LinkMagicoPanel, 'showResult');
      const copyToClipboardSpy = jest.spyOn(window.LinkMagicoPanel, 'copyToClipboard');
      
      // Inicializa o painel
      window.LinkMagicoPanel.init();
      
      // Testa submit do formulário
      document.getElementById('whatsapp').checked = true;
      form.dispatchEvent(new Event('submit'));
      
      expect(generateLinkSpy).toHaveBeenCalled();
      expect(showResultSpy).toHaveBeenCalled();
      
      // Testa botão de cópia
      copyToClipboardSpy.mockResolvedValue();
      copyBtn.click();
      
      expect(copyToClipboardSpy).toHaveBeenCalled();
    });

    test('deve prevenir submit padrão do formulário', () => {
      window.LinkMagicoPanel.init();
      
      const form = document.getElementById('linkForm');
      const submitEvent = new Event('submit');
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
      
      form.dispatchEvent(submitEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Integração - Fluxo Completo', () => {
    test('deve completar fluxo de geração de link com sucesso', () => {
      // Inicializa o painel
      window.LinkMagicoPanel.init();
      
      // Seleciona redes sociais
      document.getElementById('whatsapp').checked = true;
      document.getElementById('instagram').checked = true;
      
      // Insere nome de usuário
      document.getElementById('username').value = 'usuario_teste';
      
      // Submete formulário
      const form = document.getElementById('linkForm');
      form.dispatchEvent(new Event('submit'));
      
      // Verifica se resultado foi exibido
      const resultDiv = document.getElementById('result');
      const linkInput = document.getElementById('generatedLink');
      
      expect(resultDiv.classList.contains('hidden')).toBe(false);
      expect(linkInput.value).toContain('rede=whatsapp,instagram');
      expect(linkInput.value).toContain('user=usuario_teste');
    });

    test('deve mostrar erro quando formulário é inválido', () => {
      window.LinkMagicoPanel.init();
      
      // Submete formulário sem selecionar redes
      const form = document.getElementById('linkForm');
      form.dispatchEvent(new Event('submit'));
      
      // Verifica se erro foi exibido
      const errorDiv = document.getElementById('error');
      const resultDiv = document.getElementById('result');
      
      expect(errorDiv.classList.contains('hidden')).toBe(false);
      expect(resultDiv.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Responsividade e Acessibilidade', () => {
    test('deve ter elementos com IDs únicos', () => {
      const ids = ['whatsapp', 'instagram', 'messenger', 'tiktok', 'twitter', 'kwai', 'username', 'generateBtn', 'result', 'generatedLink', 'copyBtn', 'error'];
      
      ids.forEach(id => {
        const elements = document.querySelectorAll(`#${id}`);
        expect(elements.length).toBe(1);
      });
    });

    test('deve ter labels associados aos inputs', () => {
      const usernameInput = document.getElementById('username');
      const label = document.querySelector('label[for="username"]');
      
      expect(label).toBeTruthy();
      expect(label.getAttribute('for')).toBe('username');
    });

    test('deve ter botões com texto descritivo', () => {
      const generateBtn = document.getElementById('generateBtn');
      const copyBtn = document.getElementById('copyBtn');
      
      expect(generateBtn.textContent).toContain('Gerar Link Mágico');
      expect(copyBtn.textContent).toContain('Copiar Link');
    });
  });
});

