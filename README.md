# 🏅 Olympic Games Dashboard

Application Angular pour visualiser les données des Jeux Olympiques avec des graphiques interactifs.

## 🚀 Lancement de l'application

### Prérequis
- Node.js (version 18+)
- Angular CLI

### Installation et démarrage
```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
ng serve

# 3. Ouvrir http://localhost:4200 dans votre navigateur
```

## 📋 Fonctionnement de l'application

### Architecture
```
src/app/
├── core/
│   ├── models/           # Interfaces TypeScript
│   └── services/         # Services (logique métier)
├── pages/
│   ├── home/            # Page d'accueil avec graphique général
│   ├── detail/          # Page détail d'un pays
│   └── not-found/       # Page 404
└── app-routing.module.ts # Configuration des routes
```

### Flux de données
1. **Chargement initial** : `olympic.service.ts` charge les données depuis `assets/mock/olympic.json`
2. **Page d'accueil** : Affiche un graphique avec tous les pays et leurs médailles totales
3. **Navigation** : Clic sur un pays → redirection vers la page détail
4. **Page détail** : Affiche l'évolution des médailles du pays sélectionné par année

### Services principaux
- **`loadInitialData()`** : Charge les données depuis `olympic.json`.  
- **`getOlympics()`** : Retourne un `Observable` des données.  


### Modèles de données

**Olympic** : Représente un pays avec ses participations
```typescript
{
  id: number;
  country: string;
  participations: Participation[];
}
```

**Participation** : Représente la participation d'un pays à une édition
```typescript
{
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}
```

## 🔧 Commandes utiles

```bash
# Tests
ng test

# Build de production
ng build --prod

# Analyse du bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 📊 Données
Les données sont mockées dans `src/assets/mock/olympic.json` et contiennent les informations de 5 pays sur 3 éditions olympiques (2012, 2016, 2020).
