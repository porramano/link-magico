#!/bin/bash

# Link Mágico v5.0 - Script de Instalação
# Automatiza a instalação do Link Mágico em servidores web
# Autor: Manus AI
# Versão: 5.0.0
# Data: 22/06/2025

set -e  # Sair em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
VERSION="5.0.0"
DOMAIN="arsenalsecretodosceos.com.br"
INSTALL_DIR="/var/www/html"
BACKUP_DIR="/var/backups/link-magico"
LOG_FILE="/var/log/link-magico-install.log"

# Função para logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Função para exibir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log "INFO: $1"
}

print_success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
    log "SUCESSO: $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
    log "AVISO: $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
    log "ERRO: $1"
}

# Função para verificar se é root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Este script deve ser executado como root (use sudo)"
        exit 1
    fi
}

# Função para verificar dependências
check_dependencies() {
    print_status "Verificando dependências..."
    
    local deps=("curl" "unzip" "wget")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_warning "Dependências faltando: ${missing_deps[*]}"
        print_status "Instalando dependências..."
        
        if command -v apt-get &> /dev/null; then
            apt-get update
            apt-get install -y "${missing_deps[@]}"
        elif command -v yum &> /dev/null; then
            yum install -y "${missing_deps[@]}"
        elif command -v dnf &> /dev/null; then
            dnf install -y "${missing_deps[@]}"
        else
            print_error "Gerenciador de pacotes não suportado. Instale manualmente: ${missing_deps[*]}"
            exit 1
        fi
    fi
    
    print_success "Dependências verificadas"
}

# Função para verificar servidor web
check_webserver() {
    print_status "Verificando servidor web..."
    
    if systemctl is-active --quiet apache2; then
        print_success "Apache2 detectado e ativo"
        WEBSERVER="apache2"
    elif systemctl is-active --quiet nginx; then
        print_success "Nginx detectado e ativo"
        WEBSERVER="nginx"
    elif systemctl is-active --quiet httpd; then
        print_success "Apache (httpd) detectado e ativo"
        WEBSERVER="httpd"
    else
        print_warning "Nenhum servidor web ativo detectado"
        print_status "Tentando instalar Apache2..."
        
        if command -v apt-get &> /dev/null; then
            apt-get install -y apache2
            systemctl enable apache2
            systemctl start apache2
            WEBSERVER="apache2"
        elif command -v yum &> /dev/null; then
            yum install -y httpd
            systemctl enable httpd
            systemctl start httpd
            WEBSERVER="httpd"
        else
            print_error "Não foi possível instalar servidor web automaticamente"
            exit 1
        fi
    fi
}

# Função para criar backup
create_backup() {
    if [ -d "$INSTALL_DIR" ] && [ "$(ls -A $INSTALL_DIR)" ]; then
        print_status "Criando backup da instalação anterior..."
        
        mkdir -p "$BACKUP_DIR"
        local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        
        cp -r "$INSTALL_DIR" "$BACKUP_DIR/$backup_name"
        print_success "Backup criado em: $BACKUP_DIR/$backup_name"
    fi
}

# Função para configurar permissões
set_permissions() {
    print_status "Configurando permissões..."
    
    # Determinar usuário do servidor web
    local web_user
    if [ "$WEBSERVER" = "apache2" ]; then
        web_user="www-data"
    elif [ "$WEBSERVER" = "nginx" ]; then
        web_user="nginx"
    elif [ "$WEBSERVER" = "httpd" ]; then
        web_user="apache"
    else
        web_user="www-data"
    fi
    
    # Configurar propriedade e permissões
    chown -R "$web_user:$web_user" "$INSTALL_DIR"
    find "$INSTALL_DIR" -type d -exec chmod 755 {} \;
    find "$INSTALL_DIR" -type f -exec chmod 644 {} \;
    
    print_success "Permissões configuradas para usuário: $web_user"
}

# Função para configurar SSL (opcional)
configure_ssl() {
    print_status "Verificando configuração SSL..."
    
    if [ "$WEBSERVER" = "apache2" ]; then
        if ! apache2ctl -M | grep -q ssl_module; then
            print_status "Habilitando módulo SSL do Apache..."
            a2enmod ssl
            a2enmod rewrite
            systemctl reload apache2
        fi
    fi
    
    print_warning "Lembre-se de configurar SSL/HTTPS para o domínio $DOMAIN"
    print_warning "Recomendamos usar Let's Encrypt: https://letsencrypt.org/"
}

# Função para verificar instalação
verify_installation() {
    print_status "Verificando instalação..."
    
    local required_files=(
        "index.html"
        "iniciar.html"
        "automation/script.js"
        "manual/manual.html"
        "README.md"
    )
    
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$INSTALL_DIR/$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -ne 0 ]; then
        print_error "Arquivos faltando: ${missing_files[*]}"
        return 1
    fi
    
    print_success "Todos os arquivos necessários estão presentes"
    return 0
}

# Função para exibir informações pós-instalação
show_post_install_info() {
    echo
    echo "=============================================="
    echo "  Link Mágico v$VERSION - Instalação Concluída"
    echo "=============================================="
    echo
    print_success "Instalação concluída com sucesso!"
    echo
    echo "📍 Localização: $INSTALL_DIR"
    echo "🌐 Domínio configurado: $DOMAIN"
    echo "🔧 Servidor web: $WEBSERVER"
    echo
    echo "🚀 Próximos passos:"
    echo "1. Configure seu domínio para apontar para este servidor"
    echo "2. Configure SSL/HTTPS (recomendado)"
    echo "3. Acesse: https://$DOMAIN/index.html"
    echo "4. Leia a documentação: https://$DOMAIN/manual/manual.html"
    echo
    echo "📚 Arquivos importantes:"
    echo "- Manual: $INSTALL_DIR/manual/manual.html"
    echo "- README: $INSTALL_DIR/README.md"
    echo "- Logs de instalação: $LOG_FILE"
    echo
    echo "🆘 Suporte:"
    echo "- Email: suporte@arsenalsecretodosceos.com.br"
    echo "- Documentação: https://$DOMAIN/manual/manual.html"
    echo
    print_warning "Lembre-se de configurar SSL e testar todas as funcionalidades!"
}

# Função principal
main() {
    echo "=============================================="
    echo "  Link Mágico v$VERSION - Instalador"
    echo "=============================================="
    echo
    
    # Verificações iniciais
    check_root
    check_dependencies
    check_webserver
    
    # Criar backup se necessário
    create_backup
    
    # Verificar se os arquivos já estão no diretório atual
    if [ -f "./index.html" ] && [ -f "./iniciar.html" ]; then
        print_status "Arquivos do Link Mágico encontrados no diretório atual"
        print_status "Copiando arquivos para $INSTALL_DIR..."
        
        # Criar diretório de instalação se não existir
        mkdir -p "$INSTALL_DIR"
        
        # Copiar todos os arquivos
        cp -r ./* "$INSTALL_DIR/"
        
    else
        print_error "Arquivos do Link Mágico não encontrados no diretório atual"
        print_error "Certifique-se de executar este script no diretório do projeto"
        exit 1
    fi
    
    # Configurar permissões
    set_permissions
    
    # Configurar SSL (opcional)
    configure_ssl
    
    # Verificar instalação
    if verify_installation; then
        show_post_install_info
    else
        print_error "Falha na verificação da instalação"
        exit 1
    fi
}

# Função para limpeza em caso de erro
cleanup() {
    print_error "Instalação interrompida"
    exit 1
}

# Configurar trap para limpeza
trap cleanup INT TERM

# Executar função principal
main "$@"

