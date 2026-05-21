#!/bin/bash

# 📋 Script de vérification GeoMap Installation
# Ce script vérifie que tous les fichiers sont bien en place

echo "🔍 Vérification de l'installation GeoMap..."
echo "=============================================="
echo ""

# Vérifier les fichiers TypeScript
echo "✓ Fichiers TypeScript:"
ls -lh src/components/GeoMap.tsx 2>/dev/null && echo "  ✅ GeoMap.tsx" || echo "  ❌ GeoMap.tsx MANQUANT"
ls -lh src/lib/geoUtils.ts 2>/dev/null && echo "  ✅ geoUtils.ts" || echo "  ❌ geoUtils.ts MANQUANT"

echo ""
echo "✓ Fichiers de configuration:"
ls -lh tsconfig.json 2>/dev/null && echo "  ✅ tsconfig.json" || echo "  ❌ tsconfig.json MANQUANT"
ls -lh tsconfig.node.json 2>/dev/null && echo "  ✅ tsconfig.node.json" || echo "  ❌ tsconfig.node.json MANQUANT"

echo ""
echo "✓ Fichiers de documentation:"
ls -lh GEOMAP_DOCUMENTATION.md 2>/dev/null && echo "  ✅ GEOMAP_DOCUMENTATION.md" || echo "  ❌ GEOMAP_DOCUMENTATION.md MANQUANT"
ls -lh CHANGELOG.md 2>/dev/null && echo "  ✅ CHANGELOG.md" || echo "  ❌ CHANGELOG.md MANQUANT"
ls -lh QUICKSTART.md 2>/dev/null && echo "  ✅ QUICKSTART.md" || echo "  ❌ QUICKSTART.md MANQUANT"

echo ""
echo "✓ Assets:"
ls -lh public/medias/logo.png 2>/dev/null && echo "  ✅ Logo public" || echo "  ❌ Logo public MANQUANT"
ls -lh medias/logo.png 2>/dev/null && echo "  ✅ Logo medias" || echo "  ❌ Logo medias MANQUANT"

echo ""
echo "✓ Dependencies:"
npm list leaflet react-leaflet lucide-react @types/leaflet 2>/dev/null | head -4 && echo "  ✅ All dependencies installed" || echo "  ❌ Dependencies missing"

echo ""
echo "✓ Build:"
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build réussi"
else
    echo "  ❌ Build échoué"
fi

echo ""
echo "=============================================="
echo "✅ Vérification terminée!"
echo ""
echo "Pour démarrer le serveur de développement:"
echo "  npm run dev"
echo ""
echo "Pour consulter la documentation:"
echo "  - QUICKSTART.md (1 minute)"
echo "  - GEOMAP_DOCUMENTATION.md (complète)"
echo "  - CHANGELOG.md (détails techniques)"
