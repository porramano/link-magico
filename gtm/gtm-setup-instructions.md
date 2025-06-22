# Instruções de Configuração do Google Tag Manager

## Visão Geral
Este documento fornece instruções detalhadas para configurar o Google Tag Manager (GTM) para o projeto Link Mágico. O container GTM é responsável por detectar quando um usuário acessa um link mágico e executar automaticamente o script de automação.

## Pré-requisitos
- Conta no Google Tag Manager (gratuita)
- Acesso administrativo ao site onde será implementado
- Arquivo `gtm-container.json` fornecido no pacote

## Passo 1: Criando uma Conta no GTM

1. Acesse [tagmanager.google.com](https://tagmanager.google.com)
2. Faça login com sua conta Google
3. Clique em "Criar conta"
4. Preencha os dados:
   - Nome da conta: "Link Mágico"
   - País: Brasil
   - Nome do contêiner: Seu domínio (ex: "meusite.com")
   - Plataforma de destino: Web

## Passo 2: Importando o Container

1. No painel do GTM, clique em "Admin" no menu superior
2. Na coluna "Contêiner", clique em "Importar contêiner"
3. Clique em "Escolher arquivo de contêiner" e selecione `gtm-container.json`
4. Escolha um workspace existente ou crie um novo
5. Selecione "Mesclar" como opção de importação
6. Clique em "Confirmar"

## Passo 3: Revisando as Configurações

Após a importação, você verá os seguintes elementos:

### Tags
- **Link Mágico - Script de Automação**: Tag HTML personalizada que carrega o script de automação

### Triggers
- **Page View - URL contém ?rede=**: Trigger que ativa quando a URL contém o parâmetro `?rede=`

### Variáveis
- **Page URL**: URL completa da página
- **URL - Query String**: String de consulta da URL
- **Link Mágico - Rede**: Valor do parâmetro `rede`
- **Link Mágico - Usuário**: Valor do parâmetro `user`

## Passo 4: Instalando o GTM no Site

1. No painel do GTM, clique em "Admin" > "Instalar Google Tag Manager"
2. Copie o código do `<head>` e cole logo após a tag `<head>` do seu site
3. Copie o código do `<body>` e cole logo após a tag `<body>` do seu site

Exemplo:
```html
<!DOCTYPE html>
<html>
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXX');</script>
    <!-- End Google Tag Manager -->
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
</body>
</html>
```

## Passo 5: Publicando o Container

1. Clique em "Enviar" no canto superior direito
2. Adicione um nome para a versão (ex: "Link Mágico v1.0")
3. Adicione uma descrição (opcional)
4. Clique em "Publicar"

## Passo 6: Testando a Configuração

1. Acesse seu site com um link mágico de teste:
   `https://seusite.com/qualquer-pagina?rede=whatsapp&user=teste`

2. Abra o console do navegador (F12)

3. Verifique se aparecem as mensagens:
   - "Link Mágico: Script carregado com sucesso"
   - "Link Mágico: Iniciando automação..."

## Solução de Problemas

### Script não carrega
- Verifique se o GTM foi instalado corretamente
- Confirme se o container foi publicado
- Teste em modo de visualização do GTM

### Trigger não ativa
- Verifique se a URL contém `?rede=`
- Teste com diferentes parâmetros
- Use o modo de depuração do GTM

### Erro de CORS
- Certifique-se de que o script está hospedado em um CDN confiável
- Considere hospedar o script no mesmo domínio

## Configurações Avançadas

### Personalizando o Script
Para usar uma versão personalizada do script, edite a tag "Link Mágico - Script de Automação" e altere a URL do script.

### Adicionando Eventos Personalizados
Você pode adicionar eventos personalizados para rastrear o uso do Link Mágico:

```javascript
// Adicione este código à tag HTML personalizada
dataLayer.push({
  'event': 'link_magico_ativado',
  'rede': '{{Link Mágico - Rede}}',
  'usuario': '{{Link Mágico - Usuário}}'
});
```

### Configurando Domínios Múltiplos
Para usar o mesmo container em múltiplos domínios, adicione todos os domínios nas configurações de referência cruzada de domínio.

## Manutenção

### Atualizações do Script
Quando uma nova versão do script for lançada, atualize a URL na tag HTML personalizada e republique o container.

### Monitoramento
Use o Google Analytics ou outras ferramentas de monitoramento para acompanhar o uso dos links mágicos.

### Backup
Sempre exporte uma cópia do container antes de fazer alterações significativas.

## Suporte

Para suporte técnico ou dúvidas sobre a configuração, consulte:
- Documentação oficial do Google Tag Manager
- Manual completo do Link Mágico
- Comunidade de usuários do Link Mágico

