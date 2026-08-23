# OIA Café-Cacao — Backend Admin

API NestJS + PostgreSQL (Neon) + Prisma pour l'espace d'administration du site de l'OIA Café-Cacao. L'API sert aussi les données publiques consommées par le frontend (actualités publiées, catégories, partenaires, paramètres du site, formulaire de contact).

## Stack

- **NestJS 11** (Express)
- **Prisma 6** + **PostgreSQL** (Neon, connexion pooled + direct)
- Authentification par **session token** (Bearer) stockée en base (pas de JWT), hash **scrypt** pour les mots de passe
- **Cloudinary** pour le stockage des images et PDF
- **@nestjs/throttler** pour la limitation de débit (anti brute-force)

## Mise en route

```bash
npm install
cp .env.example .env   # puis renseigner DATABASE_URL / DIRECT_URL / CLOUDINARY_*
npx prisma migrate dev
npm run start:dev
```

Au premier démarrage, `AuthService.onModuleInit` :
1. Seed les rôles (`super_admin`, `admin`, `editor`, `manager`) et permissions (voir `src/auth/access-control.seed.ts`).
2. Crée un compte super admin par défaut si `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` sont définis et qu'aucun utilisateur n'existe avec ce mail.

Désactiver ce seed automatique en production avec `SEED_ACCESS_CONTROL=false` une fois les données stables.

## Variables d'environnement

Voir `.env.example`. Notes :
- `DATABASE_URL` = connexion **pooled** (`-pooler`), utilisée par l'app.
- `DIRECT_URL` = connexion **directe** (sans `-pooler`), utilisée uniquement par `prisma migrate`.
- `CLOUDINARY_*` : créer un compte gratuit sur cloudinary.com pour obtenir `cloud_name`, `api_key`, `api_secret`.

## Authentification & rôles

- `POST /auth/login` (public, throttled) → `{ accessToken, user }`. Envoyer ensuite `Authorization: Bearer <accessToken>`.
- `GET /auth/me` — profil courant.
- `PATCH /auth/me` — modifier son propre profil (nom, prénom, téléphone, avatar, mot de passe via `currentPassword`/`newPassword`).
- `POST /auth/logout` — révoque la session.

Sécurité :
- Compte verrouillé 15 min après 5 échecs de connexion consécutifs (`src/auth/auth.constants.ts`).
- Rate limit global (120 req/min/IP) + limite dédiée sur `/auth/login` (10 req/min/IP) et `/contact` (5 req/min/IP).
- Chaque mutation sous `/admin/*` est journalisée dans `audit_logs` (`src/audit-log/`), consultable via `GET /admin/audit-logs` (super admin uniquement).
- 4 rôles : `super_admin` (tout), `admin` (contenus + utilisateurs, pas de gestion des rôles/permissions), `editor` (création/édition de contenu), `manager` (lecture + traitement des messages de contact). Le mapping détaillé des permissions par rôle est dans `access-control.seed.ts`.

## Modules admin (`/admin/*`, protégés)

| Ressource | Endpoints |
| --- | --- |
| Utilisateurs | `/admin/utilisateurs` (CRUD), `/admin/utilisateurs/roles` |
| Partenaires | `/admin/partenaires` (CRUD) |
| Types de partenaires | `/admin/table-org` (CRUD) |
| Catégories | `/admin/categories` (CRUD) |
| Actualités | `/admin/actualites` (CRUD + `PATCH /:id/publish`) |
| Agenda / événements | `/admin/agenda` (CRUD + `PATCH /:id/publish`, images et documents associés multiples) |
| Documents (cadre réglementaire) | `/admin/documents` (CRUD) |
| Actes OIA | `/admin/actes-oia` (CRUD) |
| Projets | `/admin/projets` (CRUD) |
| Albums photos | `/admin/photo-albums` (CRUD, photos multiples imbriquées) |
| Vidéos | `/admin/videos` (CRUD) |
| Press book | `/admin/press-book` (CRUD, photos + vidéos imbriquées) |
| Campagnes | `/admin/campagnes` (CRUD) |
| Prix et tendances | `/admin/prix-tendance` (catalogue), `/admin/prix-tendance-historiques` (séries de prix par campagne) |
| Revue de presse | `/admin/revue-presse` (CRUD) |
| Messages de contact | `/admin/contact-messages` (lecture, changement de statut, suppression) |
| Paramètres du site | `/admin/site-settings` (lecture + `PATCH` upsert clé/valeur) |
| Médiathèque | `/admin/media` (upload image/PDF vers Cloudinary, liste, suppression) |
| Journal d'audit | `/admin/audit-logs` (super admin) |

Toutes les ressources avec un champ `date_pub` (documents, actes OIA, projets, vidéos, albums photos, press book, revue de presse) ne sont visibles publiquement qu'une fois `datePub <= aujourd'hui`. Actualités et agenda utilisent un statut explicite (`brouillon` / `publie` / `archive`).

## Endpoints publics

- `GET /actualites`, `GET /actualites/:slug`
- `GET /agenda`, `GET /agenda/:id`
- `GET /categories`
- `GET /partenaires`
- `GET /documents`, `GET /actes-oia`, `GET /projets`
- `GET /photo-albums`, `GET /photo-albums/:id`
- `GET /videos`
- `GET /press-book`, `GET /press-book/:id`
- `GET /revue-presse`
- `GET /campagnes`, `GET /campagnes/:id`
- `GET /prix-tendance`, `GET /prix-tendance/:id` (avec historiques imbriqués)
- `GET /site-settings` (clé/valeur pour la page d'accueil et les infos institutionnelles)
- `POST /contact` (soumission du formulaire de contact)

## Base de données

Schéma dans `prisma/schema.prisma`. Reprend toutes les tables du dump MySQL existant (partenaires, agenda, actes_oia, documents, photos, videos, press_book, campagnes, prix_tendance, projets, utilisateur, table_org, revue_presse) et ajoute ce qui manquait pour couvrir le cahier des charges : `roles`/`permissions`/`role_permissions`, `auth_sessions`, `categories`, `actualites`, `contact_messages`, `site_settings`, `media`, `audit_logs`, `agenda_images`/`agenda_documents`.

Tous les modules métier prévus par le cahier des charges sont implémentés et testés (build, lint, CRUD réel contre la base Neon, upload Cloudinary réel).
