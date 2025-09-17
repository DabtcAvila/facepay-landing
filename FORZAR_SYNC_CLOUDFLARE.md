# 🚨 FORZAR SINCRONIZACIÓN EN CLOUDFLARE

## EL PROBLEMA DETECTADO:
- En el panel: 185.199.x.x ✅
- Cloudflare sirve: 198.x.x ❌
- Nameservers: arnold/maeve ✅

## ESTO INDICA:
Cloudflare tiene un CACHE CORRUPTO o no sincronizó los cambios.

## SOLUCIONES INMEDIATAS:

### 1. FORZAR ACTUALIZACIÓN (EN CLOUDFLARE):
1. Ve a **Overview** 
2. En la esquina inferior derecha: **"Re-check now"** o **"Sync"**
3. O busca **"Purge Cache"** → **Purge Everything**

### 2. CAMBIAR TTL PARA FORZAR:
1. Edita CADA A record
2. Cambia TTL de "5 min" a **"Auto"**
3. Guarda
4. Espera 2 minutos
5. Cámbialos de vuelta a **"1 min"**
6. Guarda

### 3. VERIFICAR ZONA ACTIVA:
1. En **Overview**, verifica que dice **"Active"**
2. Si dice **"Pending"**, click en **"Check nameservers"**

### 4. ELIMINAR Y RECREAR (NUCLEAR):
1. **Borra** TODOS los A records
2. Guarda
3. Espera 1 minuto
4. **Agrega** de nuevo los 4 A records con 185.199.x.x
5. Guarda

### 5. API DIRECTA (AVANZADO):
Si tienes API token:
```bash
curl -X PUT "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"@","content":"185.199.108.153","ttl":1}'
```

## VERIFICAR QUE FUNCIONÓ:
```bash
# Debe mostrar 185.199.x.x
dig @arnold.ns.cloudflare.com facepay.com.mx A +short
```