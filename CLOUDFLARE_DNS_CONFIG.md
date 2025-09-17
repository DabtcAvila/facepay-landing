# 🔧 CONFIGURACIÓN DNS EXACTA PARA CLOUDFLARE

## PASO 1: CREAR CUENTA (Ya está abierto)
- Email: tu email
- Password: algo seguro
- Confirma el email que te envíen

## PASO 2: AGREGAR SITIO
1. Click **"Add a Site"** o **"Agregar sitio"**
2. Escribe: `facepay.com.mx`
3. Click **"Add site"**
4. Selecciona plan **FREE** ($0)
5. Click **"Continue"**

## PASO 3: CONFIGURAR DNS (COPIAR EXACTAMENTE)

Cloudflare escaneará los DNS actuales. **ELIMINA TODOS** y agrega estos:

### A Records para GitHub Pages:
```
Type: A
Name: facepay.com.mx (o @)
IPv4 address: 185.199.108.153
Proxy status: DNS only (nube gris)
TTL: Auto

Type: A
Name: facepay.com.mx (o @)
IPv4 address: 185.199.109.153
Proxy status: DNS only (nube gris)
TTL: Auto

Type: A
Name: facepay.com.mx (o @)
IPv4 address: 185.199.110.153
Proxy status: DNS only (nube gris)
TTL: Auto

Type: A
Name: facepay.com.mx (o @)
IPv4 address: 185.199.111.153
Proxy status: DNS only (nube gris)
TTL: Auto
```

### CNAME para www:
```
Type: CNAME
Name: www
Target: dabtcavila.github.io
Proxy status: DNS only (nube gris)
TTL: Auto
```

**IMPORTANTE:** 
- El "Proxy status" debe estar en **DNS only** (nube GRIS, no naranja)
- Si está naranja, click para cambiar a gris

## PASO 4: OBTENER NAMESERVERS

Cloudflare te mostrará 2 nameservers como:
```
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

**ANÓTALOS** - Los necesitas para el siguiente paso

## PASO 5: CAMBIAR EN SQUARESPACE

1. Ve a: https://account.squarespace.com/domains
2. Click en `facepay.com.mx`
3. Busca **"Nameservers"** o **"DNS Settings"** o **"Advanced Settings"**
4. Cambia de "Squarespace Nameservers" a **"Custom Nameservers"**
5. Elimina los actuales
6. Agrega los 2 de Cloudflare:
   - Nameserver 1: xxxx.ns.cloudflare.com
   - Nameserver 2: yyyy.ns.cloudflare.com
7. Save/Guardar

## PASO 6: VERIFICACIÓN

En Cloudflare:
1. Click **"Check nameservers"**
2. Espera 5 min - 2 horas
3. Recibirás email cuando esté activo

Para verificar manualmente:
```bash
# En terminal:
nslookup -type=NS facepay.com.mx

# Debe mostrar:
# xxxx.ns.cloudflare.com
# yyyy.ns.cloudflare.com
```

## PASO 7: ACTUALIZAR CNAME EN GITHUB

Una vez que Cloudflare esté activo:
```bash
cd /Users/davicho/hackathon-starknet/invisible-yield-mobile/facepay-landing

# Editar CNAME para volver a facepay.com.mx
echo "facepay.com.mx" > CNAME
git add CNAME
git commit -m "Update CNAME to facepay.com.mx"
git push
```

---

## ⏱️ TIEMPOS:
- **2-48 horas:** Propagación de nameservers (usualmente 2-6 horas)
- **5 minutos:** Una vez activo, GitHub detecta el dominio
- **1 hora:** GitHub genera certificado SSL

## 🚀 RESULTADO FINAL:
- facepay.com.mx → Tu landing en GitHub Pages
- HTTPS automático
- CDN de Cloudflare (si quieres activarlo después)
- Control total de DNS

## 📱 MIENTRAS TANTO:
Usa https://dabtcavila.github.io/facepay-landing/ para:
- Demo del hackathon
- URLs de App Store
- Compartir el proyecto