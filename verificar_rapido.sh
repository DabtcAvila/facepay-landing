#!/bin/bash

echo "🔍 VERIFICACIÓN RÁPIDA DE FACEPAY.COM.MX"
echo "========================================="
echo ""

# Verificar nameservers
echo "📡 NAMESERVERS ACTUALES:"
NAMESERVERS=$(dig facepay.com.mx NS +short | head -2)
if echo "$NAMESERVERS" | grep -q cloudflare; then
    echo "✅ Cloudflare detectado!"
else
    echo "⏳ Todavía en Google/Squarespace:"
    echo "$NAMESERVERS"
fi

echo ""
echo "🌐 SERVIDOR QUE RESPONDE:"
SERVER=$(curl -sI https://facepay.com.mx | grep -i server | cut -d: -f2)
if echo "$SERVER" | grep -qi squarespace; then
    echo "❌ Squarespace (esperando cambio)"
else
    echo "✅ $SERVER"
fi

echo ""
echo "🎯 IPs ACTUALES:"
IPS=$(dig facepay.com.mx +short)
if echo "$IPS" | grep -q "185.199"; then
    echo "✅ GitHub Pages IPs detectadas!"
    echo "$IPS"
else
    echo "⏳ Todavía IPs de Squarespace:"
    echo "$IPS"
fi

echo ""
echo "📊 RESUMEN:"
if echo "$IPS" | grep -q "185.199"; then
    echo "🎉 ¡TU DOMINIO YA FUNCIONA!"
    echo "🔗 https://facepay.com.mx"
else
    echo "⏰ Tiempo estimado: 1-4 horas desde que cambiaste nameservers"
    echo "📱 Mientras tanto usa: https://dabtcavila.github.io/facepay-landing/"
    echo ""
    echo "💡 TIP: Prueba desde tu celular con datos móviles"
    echo "       (a veces propaga más rápido en otras redes)"
fi