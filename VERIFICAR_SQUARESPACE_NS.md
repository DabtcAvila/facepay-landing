# 🚨 VERIFICAR EN SQUARESPACE

## Los nameservers NO se actualizaron

### EN SQUARESPACE VERIFICA:
1. **Domains → facepay.com.mx**
2. **Busca "Nameservers" o "DNS Provider"**
3. **DEBE DECIR:**
   - brad.ns.cloudflare.com
   - lady.ns.cloudflare.com
   (o los que Cloudflare te dio)

### SI DICE "Google Domains" o similar:
1. Click **"Edit"** o **"Change"**
2. Selecciona **"Use custom nameservers"**
3. PON los de Cloudflare:
   ```
   brad.ns.cloudflare.com
   lady.ns.cloudflare.com
   ```
4. **SAVE**

### SI YA LOS PUSISTE:
Puede que Squarespace requiera:
- Verificación por email (revisa tu correo)
- Tiempo de procesamiento (hasta 4 horas)
- Confirmación adicional

## TRUCO PARA ACELERAR:
En Squarespace, cambia el TTL:
1. Ve a Advanced Settings
2. Busca "TTL" o "Time to Live"
3. Ponlo en 300 (5 minutos)

## VERIFICAR QUE SE GUARDÓ:
Después de guardar, sal y vuelve a entrar para confirmar que los nameservers de Cloudflare están ahí.