#!/bin/bash

# Adiciona todas as mudanças
git add .

# Realiza o commit com a data e hora atual
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# Envia para o repositório remoto
git push origin main

echo "✅ Atualização enviada para o GitHub com sucesso!"
