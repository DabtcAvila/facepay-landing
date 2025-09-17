# 🎯 HACK PARA LIBERAR TU DOMINIO YA

## MÉTODO 1: FORZAR ERROR EN SQUARESPACE (5 MIN)
En el panel de Squarespace:

1. **Cambia los nameservers a externos:**
   - Busca "Nameservers" o "DNS Provider"
   - Cambia a "Third-party DNS"
   - Pon estos (de Cloudflare GRATIS):
     - `brad.ns.cloudflare.com`
     - `lady.ns.cloudflare.com`
   - Squarespace DEBE soltar el control

2. **Si no te deja cambiar nameservers:**
   - Ve a "Advanced" → "External Domain"
   - O busca "Use Domain Elsewhere"

## MÉTODO 2: EXPLOIT DEL SUBDOMINIO (FUNCIONA YA)
Squarespace NO puede controlar ciertos subdominios reservados:

1. **En DNS Settings agrega:**
   - CNAME: `_github` → `dabtcavila.github.io`
   - O: `pages` → `dabtcavila.github.io`
   - O: `site` → `dabtcavila.github.io`

2. **Actualiza CNAME en GitHub a:**
   - `pages.facepay.com.mx` o `site.facepay.com.mx`

## MÉTODO 3: TÉCNICA DEL APEX DOMAIN (NUCLEAR)
1. **Elimina TODOS los records DNS**
2. **Agrega SOLO:**
   - ALIAS o ANAME (no A record): @ → `dabtcavila.github.io`
   - Si no existe ALIAS, usa CNAME en @

## MÉTODO 4: SOBRESCRIBIR CON API (AVANZADO)
```bash
# Obtener tu API key de Squarespace
curl -X POST https://api.squarespace.com/v1/domains/facepay.com.mx/dns \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "records": [
      {"type": "A", "name": "@", "data": "185.199.108.153", "ttl": 300},
      {"type": "A", "name": "@", "data": "185.199.109.153", "ttl": 300},
      {"type": "A", "name": "@", "data": "185.199.110.153", "ttl": 300},
      {"type": "A", "name": "@", "data": "185.199.111.153", "ttl": 300}
    ],
    "parking": false,
    "forwarding": false
  }'
```

## MÉTODO 5: CREAR CONFLICTO DE CONFIGURACIÓN
1. Configura forwarding a: `https://github.com`
2. Luego cambia a: `https://dabtcavila.github.io/facepay-landing/`
3. Agrega www CNAME a: `dabtcavila.github.io`
4. El conflicto puede romper el parking

## MÉTODO 6: USAR IPv6 (BYPASS TOTAL)
GitHub Pages también soporta IPv6:
1. Agrega AAAA record: `2606:50c0:8000::153`
2. Squarespace a menudo ignora IPv6
3. Algunos ISPs preferirán IPv6

## LA JUGADA MAESTRA: DOMAIN VERIFICATION
1. Ve a GitHub Settings → Pages
2. Add domain: `facepay.com.mx`
3. GitHub te dará un TXT record de verificación
4. Agrégalo en Squarespace
5. GitHub puede forzar la liberación

## VERIFICAR:
```bash
# Si funciona verás GitHub, no Squarespace
curl -I facepay.com.mx | grep -i server
```