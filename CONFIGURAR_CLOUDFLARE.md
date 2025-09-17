# ⚡ CONFIGURAR CLOUDFLARE EN 3 MINUTOS

## PASO 1: CREAR CUENTA (GRATIS)
1. Ve a https://dash.cloudflare.com/sign-up
2. Crea cuenta con tu email
3. **IMPORTANTE:** Cuando pregunte plan, elige **FREE ($0)**

## PASO 2: AGREGAR TU DOMINIO
1. Click **"Add a Site"**
2. Escribe: `facepay.com.mx`
3. Elige plan **FREE**
4. Cloudflare escaneará DNS (ignora lo que encuentre)

## PASO 3: CONFIGURAR DNS PARA GITHUB PAGES
Elimina TODO y agrega solo estos:

**A Records (para facepay.com.mx):**
- Type: A | Name: @ | IPv4: `185.199.108.153` | Proxy: OFF (nube gris)
- Type: A | Name: @ | IPv4: `185.199.109.153` | Proxy: OFF
- Type: A | Name: @ | IPv4: `185.199.110.153` | Proxy: OFF  
- Type: A | Name: @ | IPv4: `185.199.111.153` | Proxy: OFF

**CNAME (para www):**
- Type: CNAME | Name: www | Target: `dabtcavila.github.io` | Proxy: OFF

## PASO 4: CONFIRMAR NAMESERVERS
Cloudflare te dará 2 nameservers como:
- brad.ns.cloudflare.com
- lady.ns.cloudflare.com

**¿Ya los pusiste en Squarespace? ✅**

## PASO 5: ACTIVAR
1. Click **"Done, check nameservers"**
2. Cloudflare verificará en 5-15 minutos
3. Recibirás email cuando esté activo

## RESULTADO FINAL:
✅ facepay.com.mx → Tu sitio en GitHub Pages
✅ www.facepay.com.mx → Tu sitio en GitHub Pages
✅ Sin Squarespace de intermediario
✅ Control total para siempre

## VERIFICAR:
```bash
# Cuando esté listo (5-15 min):
nslookup facepay.com.mx

# Debe mostrar:
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153
```