#!/bin/bash

echo "🚀 DEPLOYING FACEPAY TO FIREBASE"
echo "================================="
echo ""
echo "📝 INSTRUCCIONES:"
echo ""
echo "1. En Firebase Console (ya abierto):"
echo "   - Click 'Create a project' o 'Crear proyecto'"
echo "   - Nombre: facepay-starknet (o cualquier nombre disponible)"
echo "   - Desactiva Google Analytics"
echo "   - Click 'Create Project'"
echo ""
echo "2. Una vez creado, presiona ENTER aquí..."
read -p "Presiona ENTER cuando hayas creado el proyecto: "

# Preguntar el nombre del proyecto
echo ""
read -p "¿Cuál es el ID del proyecto? (ej: facepay-starknet): " PROJECT_ID

# Actualizar .firebaserc
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF

echo ""
echo "✅ Configuración actualizada"
echo ""
echo "🚀 Iniciando deployment..."
echo ""

# Deploy
firebase deploy --project $PROJECT_ID

echo ""
echo "✅ DEPLOYMENT COMPLETO!"
echo ""
echo "Tu sitio está disponible en:"
echo "  • https://$PROJECT_ID.web.app"
echo "  • https://$PROJECT_ID.firebaseapp.com"
echo ""
echo "📌 SIGUIENTE PASO: Conectar dominio"
echo "1. Ve a Firebase Console → Hosting"
echo "2. Click 'Add custom domain'"
echo "3. Escribe: facepay.com.mx"
echo "4. Firebase detectará que está en Google Domains"
echo "5. Click continuar - ¡Se conecta automáticamente!"
echo ""
echo "🎉 En 10-30 minutos facepay.com.mx estará funcionando!"