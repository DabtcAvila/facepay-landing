# ⚠️ VERIFICAR EN SQUARESPACE

## ESTO DEBE ESTAR CONFIGURADO:

### 1. NAMESERVERS:
Deben mostrar los de Cloudflare:
- brad.ns.cloudflare.com
- lady.ns.cloudflare.com
✅ Si está así, OK

### 2. DESACTIVAR TODO LO DEMÁS:

#### A. PARKING/WEBSITE:
- Si dice "Parked" → **UNPARK** o **DISABLE**
- Si dice "Connected to Website" → **DISCONNECT**
- Si dice "Forward" → **REMOVE/DISABLE**

#### B. DNS SETTINGS:
- Si Squarespace TAMBIÉN tiene DNS records → **BÓRRALOS TODOS**
- Squarespace NO debe manejar DNS si usas Cloudflare

#### C. DOMAIN SETTINGS:
Busca opciones como:
- "Use with third-party provider" → **ENABLE**
- "DNS Only Mode" → **ENABLE**
- "External DNS" → **YES**

## EL PROBLEMA COMÚN:
Squarespace puede estar:
1. **Sirviendo su propio DNS** aunque los nameservers apunten a Cloudflare
2. **Interceptando con parking** aunque no debería
3. **Manteniendo cache** de configuración vieja

## SOLUCIÓN RADICAL:
Si ves opción de:
- "Release Domain" → NO (perderías el dominio)
- "Disable All Services" → SÍ
- "DNS Only" → SÍ
- "Remove from Squarespace Sites" → SÍ

## IMPORTANTE:
Squarespace debe actuar SOLO como registrador (dueño del dominio)
NO debe:
- Manejar DNS
- Hacer parking
- Hacer forwarding
- Conectar a ningún sitio

Todo eso lo hace Cloudflare ahora.