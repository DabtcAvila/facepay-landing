#!/bin/bash

echo "🔍 VERIFICANDO DNS DE FACEPAY.COM.MX"
echo "===================================="
echo ""

# Verificar IPs
echo "📍 IPs actuales:"
nslookup facepay.com.mx 8.8.8.8 | grep Address | tail -4

echo ""
echo "✅ Cuando esté listo verás:"
echo "   185.199.108.153"
echo "   185.199.109.153"
echo "   185.199.110.153"
echo "   185.199.111.153"
echo ""

# Verificar GitHub Pages
echo "🌐 Estado en GitHub Pages:"
curl -s -o /dev/null -w "HTTP Code: %{http_code}\n" https://dabtcavila.github.io/facepay-landing/

echo ""
echo "⏱️  Tiempo estimado de propagación: 5 minutos a 48 horas"
echo "   (Normalmente 1-2 horas)"
echo ""

# Verificar si ya responde
if nslookup facepay.com.mx | grep -q "185.199"; then
    echo "🎉 ¡DNS ACTUALIZADO! facepay.com.mx ya apunta a GitHub Pages"
    echo "🔗 Prueba: https://facepay.com.mx"
else
    echo "⏳ Todavía propagándose... Intenta en 30 minutos"
    echo "📱 Mientras tanto usa: https://dabtcavila.github.io/facepay-landing/"
fi