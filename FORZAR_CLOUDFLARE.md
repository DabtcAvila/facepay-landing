# 🚀 FORZAR ACTUALIZACIÓN EN CLOUDFLARE

## EN TU DASHBOARD DE CLOUDFLARE:

### 1. VERIFICAR ESTADO:
- Si dice **"Pending"**: Click en **"Check nameservers now"**
- Si dice **"Active"**: Continúa al paso 2

### 2. PURGAR CACHE (IMPORTANTE):
1. Ve a **DNS → Records**
2. Verifica que los 4 A records muestren **185.199.x.x**
3. Si muestran **198.x.x** (Squarespace):
   - BORRA todos los A records con 198.x.x
   - AGREGA los 4 A records con 185.199.x.x
   - Click **Save**

### 3. FORZAR PROPAGACIÓN:
1. Ve a **Caching → Configuration**
2. Click **"Purge Everything"**
3. Confirma

### 4. MODO DESARROLLO:
1. Ve a **Overview**
2. En la derecha busca **"Development Mode"**
3. Actívalo por 3 horas

## VERIFICACIÓN MANUAL:
En Cloudflare → DNS → Records, asegúrate que tengas EXACTAMENTE:

```
A     @     185.199.108.153    DNS only (nube gris)
A     @     185.199.109.153    DNS only (nube gris)
A     @     185.199.110.153    DNS only (nube gris)
A     @     185.199.111.153    DNS only (nube gris)
CNAME www   dabtcavila.github.io   DNS only (nube gris)
```

NADA MÁS. Si hay otros records (especialmente A records con 198.x.x), BÓRRALOS.

## TIEMPO ESTIMADO:
- Si Cloudflare dice "Active": 5-30 minutos
- Si dice "Pending": 1-4 horas
- Máximo: 48 horas (muy raro)