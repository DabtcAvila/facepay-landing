#!/bin/bash
while true; do
    NS=$(dig facepay.com.mx NS +short | head -1)
    if echo "$NS" | grep -q cloudflare; then
        echo "🎉🎉🎉 ¡FUNCIONANDO! Nameservers actualizados a Cloudflare"
        echo "Probando dominio..."
        curl -sI https://facepay.com.mx | grep -i server
        break
    else
        echo "$(date +"%H:%M"): Esperando... (actual: $NS)"
    fi
    sleep 300
done
