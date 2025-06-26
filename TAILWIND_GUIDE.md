# 🎨 Guide Tailwind CSS - Projet Angular 9

## ✅ Installation Terminée !

Tailwind CSS v2.2.19 a été installé avec succès sur votre projet Angular 9.

## 📁 Structure des Fichiers

- `tailwind.config.js` - Configuration Tailwind
- `postcss.config.js` - Configuration PostCSS
- `src/tailwind.css` - Fichier source Tailwind
- `src/tailwind-compiled.css` - CSS compilé (3.8MB)
- `.npmrc` - Configuration npm pour legacy-peer-deps

## 🚀 Utilisation

### Classes de Base Disponibles

```html
<!-- Couleurs d'arrière-plan -->
<div class="bg-blue-500">Arrière-plan bleu</div>
<div class="bg-red-500">Arrière-plan rouge</div>
<div class="bg-green-500">Arrière-plan vert</div>

<!-- Couleurs de texte -->
<p class="text-white">Texte blanc</p>
<p class="text-gray-800">Texte gris foncé</p>

<!-- Espacement (padding/margin) -->
<div class="p-4">Padding sur tous les côtés</div>
<div class="px-4 py-2">Padding horizontal et vertical</div>
<div class="m-4">Margin sur tous les côtés</div>

<!-- Tailles -->
<div class="w-full">Largeur 100%</div>
<div class="h-64">Hauteur fixe</div>

<!-- Flexbox -->
<div class="flex items-center justify-center">Centré</div>
<div class="flex flex-col">Colonne</div>

<!-- Responsive -->
<div class="text-sm md:text-lg lg:text-xl">Texte responsive</div>
```

### Exemple Complet

```html
<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl p-8 max-w-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">
      Titre avec Tailwind
    </h1>
    <p class="text-gray-600 mb-6">
      Description avec espacement approprié.
    </p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Bouton stylé
    </button>
  </div>
</div>
```

## 🔧 Workflow de Développement

### Compilation Automatique
```bash
# Mode watch (recommandé en développement)
npx tailwindcss -i ./src/tailwind.css -o ./src/tailwind-compiled.css --watch
```

### Compilation Unique
```bash
# Compilation minifiée pour production
npx tailwindcss -i ./src/tailwind.css -o ./src/tailwind-compiled.css --minify
```

### Démarrage du Projet
```bash
npm start  # Démarre Angular avec NODE_OPTIONS configuré
```

## 📝 Configuration Tailwind

Le fichier `tailwind.config.js` surveille vos fichiers :
```javascript
module.exports = {
  purge: [
    './src/**/*.{html,ts}',  // Surveille les templates Angular
  ],
  // ...
}
```

## 🎯 Classes Utiles Fréquentes

### Layout
- `flex`, `grid`, `block`, `inline-block`
- `w-full`, `h-full`, `w-1/2`, `h-64`
- `max-w-md`, `max-w-lg`, `max-w-xl`

### Couleurs
- Bleus : `bg-blue-50` à `bg-blue-900`
- Gris : `bg-gray-50` à `bg-gray-900`
- Rouges : `bg-red-50` à `bg-red-900`

### Espacement
- `p-0` à `p-64` (padding)
- `m-0` à `m-64` (margin)
- `space-x-4`, `space-y-4` (espacement entre enfants)

### Typographie
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- `font-thin`, `font-normal`, `font-bold`
- `text-center`, `text-left`, `text-right`

## 🔍 Débogage

Si les classes ne s'appliquent pas :
1. Vérifiez que le serveur Angular est redémarré
2. Recompilez Tailwind manuellement
3. Vérifiez que le fichier `tailwind-compiled.css` est inclus dans `angular.json`

## 📖 Documentation

- [Documentation Tailwind CSS v2](https://v2.tailwindcss.com/docs)
- [Cheat Sheet Tailwind](https://nerdcave.com/tailwind-cheat-sheet)

## 🎉 Prêt à l'Emploi !

Vous pouvez maintenant utiliser toutes les classes Tailwind CSS dans vos templates Angular ! 