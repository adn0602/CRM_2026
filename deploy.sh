#!/bin/bash

echo "🚀 INICIANDO DEPLOY AUTOMÁTICO..."

# 1. Verifica se já tem git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando git..."
    git init
fi

# 2. Adiciona todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# 3. Faz commit
echo "📦 Fazendo commit..."
git commit -m "Deploy automático: $(date '+%d/%m/%Y %H:%M')"

# 4. Conecta ao GitHub (se não estiver conectado)
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📦 Conectando ao GitHub..."
    git remote add origin https://github.com/adn0602/CRM_2026.git
fi

# 5. Envia para o GitHub
echo "📦 Enviando para o GitHub..."
git branch -M main
git push -u origin main --force

# 6. Verifica se tem Vercel instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# 7. Faz login na Vercel (se necessário)
echo "📦 Verificando login na Vercel..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "📦 Fazendo login na Vercel..."
    vercel login
fi

# 8. Deploy na Vercel
echo "📦 Fazendo deploy na Vercel..."
vercel --prod

echo "✅ DEPLOY CONCLUÍDO!"
echo "🔗 Acesse: https://crm-2026.vercel.app"
