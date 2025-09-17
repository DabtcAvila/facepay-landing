#!/bin/bash

echo "🚀 ACELERANDO PROPAGACIÓN DNS PARA FACEPAY.COM.MX"
echo "=================================================="
echo ""

echo "1️⃣ LIMPIANDO CACHE DNS LOCAL..."
echo "Ejecuta este comando (te pedirá contraseña):"
echo ""
echo "sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder"
echo ""
echo "Presiona ENTER después de ejecutarlo..."
read

echo ""
echo "2️⃣ VERIFICANDO CON DIFERENTES DNS..."
echo ""
echo "Google DNS (8.8.8.8):"
nslookup facepay.com.mx 8.8.8.8 | grep -A2 "Address"
echo ""
echo "Cloudflare DNS (1.1.1.1):"
nslookup facepay.com.mx 1.1.1.1 | grep -A2 "Address"
echo ""
echo "OpenDNS (208.67.222.222):"
nslookup facepay.com.mx 208.67.222.222 | grep -A2 "Address"

echo ""
echo "3️⃣ FORZANDO ACTUALIZACIÓN..."
echo ""

# Verificar propagación global
echo "4️⃣ VERIFICANDO PROPAGACIÓN GLOBAL..."
curl -s "https://www.whatsmydns.net/api/details?server=8.8.8.8&type=A&query=facepay.com.mx" | grep -o '"ip":"[^"]*' | cut -d'"' -f4 | head -5

echo ""
echo "5️⃣ TRUCOS PARA ACELERAR:"
echo "========================"
echo ""
echo "✅ EN TU COMPUTADORA:"
echo "   • Reinicia tu router/modem"
echo "   • Cambia DNS a 1.1.1.1 o 8.8.8.8"
echo "   • Usa modo incógnito del navegador"
echo "   • Prueba con tu celular en datos móviles"
echo ""
echo "✅ EN SQUARESPACE:"
echo "   • Verifica que guardaste los cambios"
echo "   • Reduce TTL a 300 segundos si puedes"
echo "   • Revisa que no haya conflictos"
echo ""
echo "✅ VERIFICACIÓN ALTERNATIVA:"
echo "   • Abre: https://dnschecker.org/#A/facepay.com.mx"
echo "   • Si ves 185.199.xxx.xxx en algún servidor, ya está propagando"
echo ""

# Verificar si ya responde correctamente
if nslookup facepay.com.mx 1.1.1.1 2>/dev/null | grep -q "185.199"; then
    echo "🎉 ¡ÉXITO! DNS actualizado en Cloudflare (1.1.1.1)"
    echo "🔗 Prueba: https://facepay.com.mx"
elif nslookup facepay.com.mx 8.8.8.8 2>/dev/null | grep -q "185.199"; then
    echo "🎉 ¡ÉXITO! DNS actualizado en Google (8.8.8.8)"
    echo "🔗 Prueba: https://facepay.com.mx"
else
    echo "⏳ Todavía propagándose..."
    echo ""
    echo "🔥 ÚLTIMO RECURSO - HOSTS FILE (SOLO PARA PROBAR):"
    echo "   sudo nano /etc/hosts"
    echo "   Agrega: 185.199.108.153 facepay.com.mx"
    echo "   Agrega: 185.199.108.153 www.facepay.com.mx"
    echo "   (Esto es solo para TU computadora)"
fi

echo ""
echo "📱 URL ALTERNATIVA QUE YA FUNCIONA:"
echo "   https://dabtcavila.github.io/facepay-landing/"