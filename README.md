# LHA Engineering — Site Web

Application React + Tailwind CSS v4 + TypeScript.  
**Tout l'environnement tourne sous Docker (Ubuntu 24.04 Noble) — aucune installation locale requise.**

Le projet inclut maintenant :
- un frontend React avec pages dédiées par label via React Router
- une API Node/Express pour le formulaire de contact (`/api/contact`)
- une préparation de déploiement production avec Nginx + HTTPS + Let's Encrypt

## Prérequis

- Docker installé sur la machine hôte
- `make` disponible (`sudo apt install make`)

## Commandes

| Commande | Action |
|---|---|
| `make dev` | Build l'image puis lance le frontend Vite + l'API contact |
| `make dev-d` | Idem en arrière-plan |
| `make stop` | Arrête le container |
| `make shell` | Ouvre un shell Ubuntu dans le container |
| `make add PKG=nom` | Installe un paquet npm runtime |
| `make add-dev PKG=nom` | Installe un paquet npm de dev |
| `make build-prod` | Build frontend de production dans `dist/` |
| `make lint` | Lint ESLint |
| `make rebuild` | Rebuild l'image sans cache |
| `make clean` | Reset complet (container + volume + image) |
| `make prod-build` | Build les images de production API + Web |
| `make prod-up` | Démarre la stack production Docker |
| `make prod-down` | Arrête la stack production Docker |
| `make prod-certbot` | Génère les certificats Let's Encrypt |

## Formulaire de contact

- En développement, le formulaire poste vers `/api/contact`.
- Sans configuration SMTP, l'API enregistre les messages dans `server/submissions/`.
- En production, définis les variables SMTP dans `.env` pour activer l'envoi d'email.
- Protection anti-spam légère activée : honeypot, délai minimal de soumission et rate limit mémoire côté API.

Fichier d'environnement :

```bash
cp .env.example .env
```

## Déploiement production

1. Renseigner `.env` avec SMTP, `DOMAIN` et `LETSENCRYPT_EMAIL`.
2. Générer les certificats :

```bash
make prod-certbot
```

3. Démarrer la stack :

```bash
make prod-up
```

Test local de la stack production :

- Si aucun certificat Let's Encrypt n'est présent, `make prod-up` génère automatiquement un certificat auto-signé.
- Tu peux alors tester localement :

```bash
curl -k https://127.0.0.1/api/health
```

- Puis arrêter la stack :

```bash
make prod-down
```

Images et services :
- `Dockerfile.api` : API Express pour le formulaire de contact
- `Dockerfile.web` : build frontend + runtime Nginx
- `deploy/nginx/default.conf` : reverse proxy `/api`, fallback SPA et TLS
