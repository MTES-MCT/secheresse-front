![Logo VigiEau](https://vigieau.gouv.fr/logo_vigie_eau.svg)

# VigiEau - frontend

## Description

VigiEau a été lancée par le Ministère de la Transition Ecologique pour aider les citoyens à avoir un accès facile et clair à
l'information concernant les restrictions en vigueur lors d'épisodes d'alertes sécheresse.

## Installation

### Pré-requis

Vous aurez besoin de [NodeJS](https://nodejs.org/) v18+ et [Yarn](https://yarnpkg.com/) pour lancer ce projet.

Nous vous recommandons de regarder la [documentation de Nuxt 3](https://v3.nuxtjs.org)
et la [documentation de VueDsfr](https://vue-dsfr.netlify.app).

### Variables d'environnement

```bash
cp env.example .env
```

Doc [API Adresse](https://adresse.data.gouv.fr/api-doc/adresse)

Doc [API Geo](https://geo.api.gouv.fr/decoupage-administratif)

Doc [API Sécheresse](https://github.com/MTES-MCT/secheresse-api)

### Installation des dépendances

```bash
yarn install
```

### Lancer nuxt en mode développement

Démarre le serveur sur http://localhost:3000

```bash
yarn dev
```

### Générer le code de production

Génère le code de production de l’application:

```bash
yarn build
```

Regarder ensuite la [documentation de Nuxt concernant le déploiement](https://v3.nuxtjs.org/docs/deployment).

### Lancer les tests e2e

Regarder la documentation de [Cypress](https://www.cypress.io/)

Pour ouvrir l'interface de Cypress

```bash
yarn cy:open
```

Si l'application est lancée

```bash
yarn cy:run
```

Pour lancer l'application et les tests

```bash
yarn cy:e2e
```

## Contribution

Les Pull Requests sont les bienvenues. Pour des changements majeurs merci d'ouvrir auparavant une issue pour en discuter.

Assurez-vous de mettre à jour les tests en conséquence.

## License

[MIT](https://choosealicense.com/licenses/mit/)
