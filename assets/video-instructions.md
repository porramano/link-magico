# 🎬 Instruções para Vídeo Tutorial

## 📹 Sobre o Vídeo Tutorial

O Link Mágico v1.0.0 inclui um roteiro completo para criação de vídeo tutorial de 2-3 minutos explicando como usar o sistema. 

### 📋 Conteúdo do Vídeo

O vídeo deve cobrir:
1. **Introdução** ao Link Mágico
2. **Acesso** ao painel web
3. **Seleção** de redes sociais
4. **Geração** do link mágico
5. **Cópia** e uso do link
6. **Configuração** nas redes sociais
7. **Monitoramento** via analytics
8. **Personalização** de templates
9. **Visualização** de logs
10. **Configuração** do GTM

### 📝 Legendas Incluídas

O arquivo `assets/tutorial-legendas.srt` contém legendas sincronizadas no formato padrão SRT, compatível com:
- YouTube
- Vimeo
- Amara.org
- Outros players de vídeo

### 🎥 Criação do Vídeo

#### Opção 1: Screencast Simples
1. Use OBS Studio ou similar
2. Grave a tela navegando pelo painel
3. Adicione narração em português
4. Exporte em MP4 (1080p recomendado)

#### Opção 2: Vídeo Profissional
1. Use Camtasia ou Adobe Premiere
2. Adicione animações e transições
3. Inclua música de fundo (opcional)
4. Adicione call-to-actions

#### Opção 3: Vídeo Animado
1. Use Loom ou Animaker
2. Crie animações explicativas
3. Adicione voiceover profissional
4. Inclua elementos visuais atraentes

### 📤 Upload e Legendas via Amara.org

#### Passo 1: Criar Conta
1. Acesse https://amara.org
2. Clique em "Sign Up" (Cadastrar)
3. Preencha os dados básicos
4. Confirme o email

#### Passo 2: Upload do Vídeo
1. Primeiro, faça upload do vídeo no YouTube ou Vimeo
2. Copie a URL do vídeo
3. No Amara, clique em "Add Video"
4. Cole a URL do vídeo
5. Preencha título e descrição

#### Passo 3: Adicionar Legendas
1. Clique em "Add Subtitles"
2. Selecione "Português (Brasil)"
3. Escolha "Upload a subtitle file"
4. Faça upload do arquivo `tutorial-legendas.srt`
5. Revise e ajuste se necessário

#### Passo 4: Publicar
1. Clique em "Publish"
2. Copie o link da versão legendada
3. Adicione o link ao manual do usuário

### 🔗 Integração com o Manual

Após criar o vídeo legendado:

1. **Atualize o manual** (`manual/manual.html` e `manual/manual.md`)
2. **Adicione a seção** "🎬 Vídeo Tutorial"
3. **Inclua o link** do Amara.org
4. **Adicione instruções** para assistir com legendas

Exemplo de código para adicionar ao manual:

```html
<div class="video-section">
    <h3>🎬 Vídeo Tutorial</h3>
    <p>Assista ao tutorial completo com legendas:</p>
    <a href="https://amara.org/videos/XXXXX/" target="_blank" class="video-link">
        📺 Assistir Tutorial com Legendas
    </a>
    <p><small>Duração: 3 minutos | Legendas em Português</small></p>
</div>
```

### 📊 Métricas do Vídeo

Acompanhe o desempenho:
- **Visualizações** no YouTube/Vimeo
- **Engajamento** (likes, comentários)
- **Tempo de retenção** dos espectadores
- **Cliques** no link do manual
- **Conversões** para uso do Link Mágico

### 🎯 Dicas para Sucesso

1. **Mantenha simples** - Foque no essencial
2. **Use linguagem clara** - Evite jargões técnicos
3. **Mostre resultados** - Demonstre o link funcionando
4. **Inclua call-to-action** - Incentive o uso
5. **Teste antes** - Verifique áudio e vídeo

### 📱 Versões Adicionais

Considere criar:
- **Versão curta** (30 segundos) para redes sociais
- **Versão mobile** otimizada para celular
- **Versão em inglês** para audiência internacional
- **Tutoriais específicos** para cada rede social

### 🔄 Atualizações Futuras

Quando lançar novas versões:
1. Atualize o vídeo com novas funcionalidades
2. Mantenha as legendas sincronizadas
3. Crie vídeos complementares
4. Atualize links no manual

---

## 📞 Suporte para Criação

Se precisar de ajuda com:
- **Roteiro** - Use o arquivo SRT como base
- **Gravação** - Consulte tutoriais do OBS Studio
- **Edição** - Use ferramentas gratuitas como DaVinci Resolve
- **Upload** - Siga as instruções do Amara.org

---

**🎬 Boa sorte com a criação do seu vídeo tutorial!**

*Arquivo criado automaticamente pelo Link Mágico v1.0.0*

