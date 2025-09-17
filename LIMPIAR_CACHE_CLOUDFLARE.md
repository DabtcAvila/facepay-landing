# 🔄 FORZAR ACTUALIZACIÓN EN CLOUDFLARE

## SI TUS DNS ESTÁN CORRECTOS (185.199.x.x) PERO NO FUNCIONAN:

### 1. PURGAR CACHE DE CLOUDFLARE:
1. Ve a **Caching** → **Configuration**
2. Click **"Purge Everything"**
3. Confirma

### 2. VERIFICAR PROXY STATUS:
1. Ve a **DNS** → **Records**
2. TODOS los records deben tener la **nube GRIS** (DNS only)
3. Si alguno tiene **nube NARANJA**, click para cambiar a GRIS

### 3. VERIFICAR QUE NO HAY RECORDS DUPLICADOS:
- Solo debe haber 4 A records con @
- Si hay más de 4, borra los que tengan 198.x.x.x

### 4. VERIFICAR TTL:
1. Click en "Edit" en cada A record
2. TTL debe ser "Auto" o "1 min" (300 segundos)
3. NO debe ser 86400 o valores altos

### 5. GUARDAR Y ESPERAR:
Después de cambios, tarda 1-5 minutos en propagar dentro de Cloudflare

## VERIFICACIÓN RÁPIDA:
```bash
# Debería mostrar 185.199.x.x
dig @brad.ns.cloudflare.com facepay.com.mx A +short
```

## SI NADA FUNCIONA:
Puede que Cloudflare haya importado automáticamente los DNS de Squarespace cuando agregaste el dominio. 

**SOLUCIÓN NUCLEAR:**
1. Borra el dominio de Cloudflare completamente
2. Agrégalo de nuevo
3. Cuando pregunte "Import DNS records?", di NO
4. Agrega manualmente solo los 5 records correctos