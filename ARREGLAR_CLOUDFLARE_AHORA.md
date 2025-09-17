# 🚨 URGENTE - ARREGLAR DNS EN CLOUDFLARE

## EL PROBLEMA:
Los A records en Cloudflare tienen las IPs INCORRECTAS (198.x.x.x de Squarespace)

## SOLUCIÓN INMEDIATA:

### 1. ENTRA A CLOUDFLARE:
https://dash.cloudflare.com

### 2. Click en facepay.com.mx → DNS

### 3. BORRA TODOS los A records que veas

### 4. AGREGA ESTOS 4 A RECORDS NUEVOS:
```
Type: A
Name: @  
IPv4 address: 185.199.108.153
Proxy status: DNS only (NUBE GRIS)

Type: A
Name: @
IPv4 address: 185.199.109.153
Proxy status: DNS only (NUBE GRIS)

Type: A  
Name: @
IPv4 address: 185.199.110.153
Proxy status: DNS only (NUBE GRIS)

Type: A
Name: @
IPv4 address: 185.199.111.153
Proxy status: DNS only (NUBE GRIS)
```

### 5. VERIFICA que solo tengas:
- 4 A records con 185.199.xxx.xxx
- 1 CNAME www → dabtcavila.github.io
- NADA MÁS

### 6. GUARDA

## IMPORTANTE:
Si ves A records con:
- 198.49.23.xxx
- 198.185.159.xxx

¡BÓRRALOS! Esos son de Squarespace.