.PHONY: build dev dev-d stop shell add add-dev build-prod lint rebuild clean prod-build prod-up prod-down prod-logs prod-certbot

IMAGE     = lha-engineering-dev
CONTAINER = lha-engineering-dev
VOLUME    = lha_node_modules

## ── Image ───────────────────────────────────────────────────────────────────
# Construire l'image Docker de développement
build:
	docker build -f Dockerfile.dev -t $(IMAGE) .

## ── Développement ───────────────────────────────────────────────────────────
# Lancer le serveur de dev (interactif, Ctrl-C pour arrêter)
dev: build
	docker run --rm -it \
	  --name $(CONTAINER) \
	  -p 5173:5173 \
	  -v $(PWD):/app \
	  -v $(VOLUME):/app/node_modules \
	  $(IMAGE)

# Lancer en arrière-plan
dev-d: build
	docker run --rm -d \
	  --name $(CONTAINER) \
	  -p 5173:5173 \
	  -v $(PWD):/app \
	  -v $(VOLUME):/app/node_modules \
	  $(IMAGE)

# Arrêter le container
stop:
	docker stop $(CONTAINER)

# Ouvrir un shell dans le container en cours d'exécution
shell:
	docker exec -it $(CONTAINER) sh

## ── Gestion des paquets (sans npm sur la machine hôte) ─────────────────────
# Ajouter un paquet runtime     → make add PKG=some-lib
add:
	docker exec $(CONTAINER) npm install $(PKG)

# Ajouter un paquet de dev      → make add-dev PKG=vitest
add-dev:
	docker exec $(CONTAINER) npm install --save-dev $(PKG)

## ── Build production ────────────────────────────────────────────────────────
build-prod:
	docker run --rm \
	  -v $(PWD):/app \
	  -v $(VOLUME):/app/node_modules \
	  $(IMAGE) npm run build

## ── Lint ────────────────────────────────────────────────────────────────────
lint:
	docker exec $(CONTAINER) npm run lint

## ── Maintenance ─────────────────────────────────────────────────────────────
# Reconstruire l'image sans cache (après modif de Dockerfile.dev ou package.json)
rebuild:
	docker build --no-cache -f Dockerfile.dev -t $(IMAGE) .

# Reset complet : stoppe le container, supprime le volume et l'image
clean:
	docker stop $(CONTAINER) 2>/dev/null || true
	docker volume rm $(VOLUME) 2>/dev/null || true
	docker rmi $(IMAGE) 2>/dev/null || true

## ── Production ──────────────────────────────────────────────────────────────
prod-build:
	bash scripts/prod-build.sh

prod-up:
	bash scripts/prod-up.sh

prod-down:
	bash scripts/prod-down.sh

prod-logs:
	docker logs -f lha-engineering-web

prod-certbot:
	bash scripts/prod-init-letsencrypt.sh
