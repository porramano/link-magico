# Link Mágico v5.0 🪄

**Automação Inteligente de Respostas para Redes Sociais**

O Link Mágico v5.0 é uma ferramenta revolucionária que automatiza respostas personalizadas via ChatGPT para múltiplas redes sociais, com extração inteligente de dados de páginas de vendas e injeção automática de prompts.

## 🚀 Novidades da Versão 5.0

### ✨ Funcionalidades Principais
- **Extração Automática de Dados**: Coleta informações de páginas de vendas automaticamente
- **Geração de Prompts Inteligentes**: Cria prompts personalizados baseados nos dados extraídos
- **Injeção Automática no ChatGPT**: Injeta prompts diretamente no ChatGPT Web
- **Suporte a 8 Redes Sociais**: WhatsApp, Instagram, Messenger, TikTok, Twitter/X, Kwai, YouTube e ChatGPT
- **Validação Avançada**: Validação de nomes de robôs e URLs em tempo real
- **Fallbacks Robustos**: Sistema de recuperação em caso de falha na automação
- **Timer de Inatividade**: Encerramento automático após 60 segundos de inatividade

### 🔧 Melhorias Técnicas
- **Proxy CORS**: Utiliza `allorigins.win` para extração de dados cross-origin
- **Interface Responsiva**: Design otimizado para desktop e mobile
- **Logs Detalhados**: Sistema de logging completo para debugging
- **Ambiente Real**: Configurado para o domínio `arsenalsecretodosceos.com.br`

## 📋 Requisitos

- Navegador moderno com suporte a ES6+
- Conexão com internet
- Domínio configurado (arsenalsecretodosceos.com.br)
- Servidor web (Apache, Nginx, ou similar)

## 🛠️ Instalação

### Opção 1: Upload Direto
1. Faça upload de todos os arquivos para seu servidor web
2. Configure o domínio para apontar para a pasta do projeto
3. Acesse `https://arsenalsecretodosceos.com.br/index.html`

### Opção 2: Script de Instalação
```bash
chmod +x install.sh
./install.sh
```

## 📖 Como Usar

### 1. Configuração Inicial
1. Acesse o painel principal em `index.html`
2. Preencha os campos obrigatórios:
   - **Nome do robô/assistente**: Deve começar com @ (ex: @vendas_bot)
   - **Link da página de vendas**: URL completa da página para extração de dados
   - **Redes sociais**: Selecione as plataformas desejadas
   - **Nome de usuário**: (Opcional) Para links diretos

### 2. Geração do Link Mágico
1. Clique em "Gerar Link Mágico v5.0"
2. Copie o link gerado
3. Compartilhe o link com seus clientes/prospects

### 3. Funcionamento da Automação
Quando um usuário clica no link mágico:

1. **Extração de Dados**: O sistema extrai automaticamente:
   - Título do produto/serviço
   - Descrição
   - Preço
   - Benefícios
   - Depoimentos
   - Call-to-action

2. **Geração de Prompt**: Cria um prompt personalizado com:
   - Informações do produto
   - Instruções para o assistente
   - Contexto das redes sociais

3. **Injeção no ChatGPT**: Se selecionado:
   - Abre o ChatGPT Web
   - Injeta o prompt automaticamente
   - Tenta enviar automaticamente

4. **Redirecionamento**: Abre as redes sociais selecionadas:
   - WhatsApp: Com texto pré-preenchido
   - Instagram: Direct Messages
   - Messenger: Chat direto
   - Outras redes: Perfil/chat do usuário

## 🔗 Formato do Link Mágico v5.0

```
https://arsenalsecretodosceos.com.br/iniciar?robo=@nome_bot&pagina=https://exemplo.com/produto&rede=whatsapp,chatgpt&user=usuario
```

### Parâmetros:
- `robo`: Nome do assistente (obrigatório, deve começar com @)
- `pagina`: URL da página de vendas (obrigatório)
- `rede`: Redes sociais separadas por vírgula (obrigatório)
- `user`: Nome de usuário (opcional)

## 🌐 Redes Sociais Suportadas

| Rede Social | Código | Suporte a Texto | Funcionalidade |
|-------------|--------|-----------------|----------------|
| WhatsApp | `whatsapp` | ✅ | Texto pré-preenchido |
| Instagram | `instagram` | ❌ | Direct Messages |
| Messenger | `messenger` | ❌ | Chat direto |
| TikTok | `tiktok` | ❌ | Perfil do usuário |
| Twitter/X | `twitter` | ❌ | Messages |
| Kwai | `kwai` | ❌ | Perfil do usuário |
| YouTube | `youtube` | ❌ | Canal do usuário |
| ChatGPT | `chatgpt` | ✅ | Injeção de prompt |

## 🛡️ Validações e Segurança

### Validações Implementadas:
- **Nome do robô**: Deve começar com @ e conter apenas letras, números e underscores
- **URL da página**: Validação de formato de URL válida
- **Redes sociais**: Pelo menos uma rede deve ser selecionada

### Segurança:
- Sanitização de parâmetros de URL
- Validação de entrada em tempo real
- Tratamento de erros robusto
- Logs de segurança

## 🔧 Configuração Avançada

### Personalização do Domínio
Para usar um domínio diferente, edite a constante `DOMAIN` em:
- `index.html` (linha ~400)
- `script.js` (linha ~15)

### Configuração do Proxy CORS
O sistema usa `allorigins.win` por padrão. Para usar outro proxy:
```javascript
const CONFIG = {
    corsProxy: 'https://seu-proxy.com/get?url='
};
```

### Timeout de Inatividade
Para alterar o tempo de encerramento automático:
```javascript
const CONFIG = {
    inactivityTimeout: 60000 // 60 segundos
};
```

## 📊 Monitoramento e Logs

### Logs do Console
O sistema gera logs detalhados no console do navegador:
```
[14:30:25] Link Mágico v5.0: Iniciando automação...
[14:30:26] Link Mágico v5.0: Extraindo dados da página...
[14:30:28] Link Mágico v5.0: Prompt gerado com sucesso
```

### Tipos de Log:
- `info`: Informações gerais
- `success`: Operações bem-sucedidas
- `warning`: Avisos importantes
- `error`: Erros e falhas

## 🚨 Solução de Problemas

### Problemas Comuns:

#### 1. Extração de Dados Falha
**Causa**: Página protegida por CORS ou inacessível
**Solução**: O sistema usa dados padrão automaticamente

#### 2. Injeção no ChatGPT Falha
**Causa**: Mudanças na interface do ChatGPT
**Solução**: Sistema exibe interface de fallback com opções manuais

#### 3. Pop-ups Bloqueados
**Causa**: Bloqueador de pop-ups do navegador
**Solução**: Permitir pop-ups para o domínio ou usar fallback

#### 4. Link Não Funciona
**Causa**: Parâmetros inválidos ou malformados
**Solução**: Verificar formato do link e parâmetros obrigatórios

### Debugging:
1. Abra o console do navegador (F12)
2. Verifique os logs do Link Mágico
3. Teste com parâmetros simples primeiro
4. Verifique se o domínio está configurado corretamente

## 📁 Estrutura de Arquivos

```
automaclick_v5/
├── index.html              # Painel principal
├── iniciar.html            # Página de automação
├── automation/
│   └── script.js           # Script principal v5.0
├── manual/
│   ├── manual.html         # Manual em HTML
│   ├── manual.md           # Manual em Markdown
│   └── manual.pdf          # Manual em PDF
├── features/
│   ├── templates.html      # Templates de mensagem
│   ├── analytics.html      # Dashboard analytics
│   └── logs.html          # Histórico e logs
├── assets/
│   └── ...                # Recursos adicionais
├── tests/
│   └── test-log.md        # Log de testes
├── README.md              # Este arquivo
├── CHANGELOG.md           # Histórico de mudanças
└── install.sh            # Script de instalação
```

## 🔄 Atualizações

### Versão 5.0.0 (Atual)
- Extração automática de dados de páginas de vendas
- Geração de prompts inteligentes
- Injeção automática no ChatGPT
- Suporte a YouTube e ChatGPT
- Interface completamente redesenhada
- Sistema de fallback robusto
- Validações avançadas
- Logs detalhados

### Versões Anteriores:
- v4.x: Sistema básico de redirecionamento
- v3.x: Suporte a múltiplas redes sociais
- v2.x: Interface web
- v1.x: Conceito inicial

## 🤝 Suporte

Para suporte técnico ou dúvidas:
- **Email**: suporte@arsenalsecretodosceos.com.br
- **Documentação**: Consulte o manual completo em `manual/manual.html`
- **Logs**: Verifique o console do navegador para debugging

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🙏 Agradecimentos

- Equipe de desenvolvimento Manus AI
- Comunidade de usuários e testadores
- Contribuidores do projeto

---

**Link Mágico v5.0** - Transformando a automação de vendas com inteligência artificial.

*Desenvolvido com ❤️ pela equipe Manus AI*

