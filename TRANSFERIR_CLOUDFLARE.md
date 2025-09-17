# 🚀 TRANSFERIR FACEPAY.COM.MX A CLOUDFLARE (GRATIS)

## ¿POR QUÉ CLOUDFLARE?
- ✅ DNS GRATIS de por vida
- ✅ Control total de DNS
- ✅ CDN y protección DDoS gratis
- ✅ SSL/HTTPS automático
- ✅ Interfaz fácil de usar

## PASOS (15 minutos):

### 1. CREAR CUENTA EN CLOUDFLARE
1. Ve a: https://www.cloudflare.com
2. Sign Up (gratis)
3. Confirma tu email

### 2. AGREGAR TU DOMINIO
1. Click "Add a Site"
2. Escribe: facepay.com.mx
3. Selecciona plan FREE
4. Cloudflare escaneará los DNS actuales

### 3. CONFIGURAR DNS EN CLOUDFLARE
Agrega estos registros:

```
Type: A
Name: @
Content: 185.199.108.153
Proxy: OFF (gris)

Type: A  
Name: @
Content: 185.199.109.153
Proxy: OFF (gris)

Type: A
Name: @  
Content: 185.199.110.153
Proxy: OFF (gris)

Type: A
Name: @
Content: 185.199.111.153  
Proxy: OFF (gris)

Type: CNAME
Name: www
Content: dabtcavila.github.io
Proxy: OFF (gris)
```

### 4. CAMBIAR NAMESERVERS EN SQUARESPACE
1. Cloudflare te dará 2 nameservers como:
   - algo.ns.cloudflare.com
   - otro.ns.cloudflare.com

2. En Squarespace → facepay.com.mx → DNS Settings
3. Busca "Nameservers" o "DNS Provider"
4. Cambia a los de Cloudflare

### 5. ESPERAR PROPAGACIÓN
- 5 minutos a 48 horas (usualmente 2 horas)
- Cloudflare te enviará email cuando esté listo

## RESULTADO FINAL:
- facepay.com.mx → Tu landing en GitHub Pages
- Control total de DNS
- Puedes agregar subdominios cuando quieras
- CDN global automático

---

## ALTERNATIVA TEMPORAL:
Mientras se propaga, usa:
https://dabtcavila.github.io/facepay-landing/

Para App Store, estos URLs ya funcionan:
- Privacy: https://dabtcavila.github.io/facepay-landing/privacy.html
- Terms: https://dabtcavila.github.io/facepay-landing/terms.html
- Support: https://dabtcavila.github.io/facepay-landing/support.html