# 🔥 FORZAR LIBERACIÓN DE DOMINIO EN SQUARESPACE

## EL PROBLEMA
Squarespace está interceptando tu dominio porque:
1. Tienes un sitio web activo usándolo
2. Está en modo "Squarespace Managed"
3. Tiene forwarding o parking activado

## SOLUCIÓN DEFINITIVA

### OPCIÓN A: CHAT DE SOPORTE (5 minutos)
1. Ve a Squarespace
2. Click en el ícono de chat (esquina inferior derecha)
3. Escribe EXACTAMENTE esto:
```
I need to point my domain facepay.com.mx to GitHub Pages.
I've already set the DNS A records to:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
But Squarespace is still intercepting the domain.
Please disable Squarespace hosting for this domain.
```

### OPCIÓN B: CAMBIAR NAMESERVERS (Radical pero efectivo)
En vez de cambiar DNS records, cambia los NAMESERVERS:

1. En Squarespace → facepay.com.mx
2. Busca "Nameservers" o "DNS Provider"
3. Cambiar a "External DNS Provider"
4. Usa los nameservers de Cloudflare (gratis):
   - ns1.dnsimple.com
   - ns2.dnsimple.com
   
O los de Namecheap:
   - dns1.registrar-servers.com
   - dns2.registrar-servers.com

### OPCIÓN C: TRANSFERIR EL DOMINIO
1. Unlock domain en Squarespace
2. Get authorization code
3. Transfiérelo a:
   - Namecheap ($10/año)
   - Porkbun ($8/año)
   - Cloudflare (precio de costo)

## VERIFICACIÓN
```bash
# Debe mostrar 185.199.x.x, NO 198.x.x.x
nslookup facepay.com.mx

# Si sigue mostrando 198.x.x.x = Squarespace lo tiene bloqueado
```

## SOLUCIÓN TEMPORAL PROFESIONAL
Mientras resuelves con Squarespace, puedes:

1. Usar un redirect profesional:
   - En Squarespace configura Forward
   - Forward to: https://dabtcavila.github.io/facepay-landing/
   - Type: 301 Permanent
   
2. O crear subdominio:
   - app.facepay.com.mx → GitHub Pages
   - Los subdominios son más fáciles de configurar

## REALIDAD
Squarespace es NOTORIO por hacer esto. Quieren que uses su hosting.
Si el soporte no ayuda, transferir el dominio es la mejor opción.