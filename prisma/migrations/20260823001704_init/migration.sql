-- CreateEnum
CREATE TYPE "PartenaireType" AS ENUM ('institutionnels', 'techniques', 'financiers');

-- CreateEnum
CREATE TYPE "CampagneType" AS ENUM ('principale', 'intermediaire');

-- CreateEnum
CREATE TYPE "CampagneStatut" AS ENUM ('active', 'inactive', 'cloturee');

-- CreateEnum
CREATE TYPE "StatutPublication" AS ENUM ('brouillon', 'publie', 'archive');

-- CreateEnum
CREATE TYPE "ContactStatut" AS ENUM ('nouveau', 'lu', 'traite', 'archive');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'document', 'video');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete', 'login', 'login_failed', 'logout');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_org" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partenaires" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "type" "PartenaireType" NOT NULL DEFAULT 'institutionnels',
    "type_org" INTEGER,
    "description" TEXT,
    "logo" VARCHAR(255),
    "contact_name" VARCHAR(255),
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "site" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partenaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revue_presse" (
    "id" SERIAL NOT NULL,
    "auteur" VARCHAR(255) NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image_couverture" VARCHAR(255),
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revue_presse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_deb" DATE NOT NULL,
    "date_fin" DATE,
    "ville" VARCHAR(255),
    "addresse" TEXT,
    "image_couverture" VARCHAR(255),
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actes_oia" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "pdf_file" VARCHAR(255) NOT NULL,
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actes_oia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "pdf_file" VARCHAR(255) NOT NULL,
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_albums" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER,
    "titre" VARCHAR(255) NOT NULL,
    "photo_file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "auteur" VARCHAR(255) NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "youtube_url" TEXT,
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_book" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_book_photos" (
    "id" SERIAL NOT NULL,
    "press_book_id" INTEGER NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "photo_file" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "press_book_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_book_videos" (
    "id" SERIAL NOT NULL,
    "press_book_id" INTEGER NOT NULL,
    "youtube_url" VARCHAR(255) NOT NULL,
    "titre" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "press_book_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campagnes" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "type_campagne" "CampagneType" NOT NULL DEFAULT 'principale',
    "date_debut" DATE NOT NULL,
    "date_fin" DATE NOT NULL,
    "statut" "CampagneStatut" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campagnes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prix_tendance" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prix_tendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prix_tendance_historiques" (
    "id" SERIAL NOT NULL,
    "prix_tandance_id" INTEGER NOT NULL,
    "campagne_id" INTEGER,
    "prix_nat" DECIMAL(15,3) NOT NULL DEFAULT 0,
    "prix_inter" DECIMAL(15,3) NOT NULL DEFAULT 0,
    "pmg_bord_champ" DECIMAL(15,3),
    "differentiel_ramassage" DECIMAL(15,3),
    "forfait_transport" DECIMAL(15,3),
    "entree_usine" DECIMAL(15,3),
    "loco_magasin" DECIMAL(15,3),
    "fob_garanti" DECIMAL(15,3),
    "caf_garanti_eu" DECIMAL(15,3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prix_tendance_historiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projets" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_deb" DATE,
    "date_fin" DATE,
    "image_couverture" VARCHAR(255),
    "pdf_file" VARCHAR(255),
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "avatar" VARCHAR(255),
    "role_id" INTEGER,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "must_change_password" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actualites" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(280) NOT NULL,
    "contenu" TEXT NOT NULL,
    "extrait" TEXT,
    "auteur" VARCHAR(255) NOT NULL,
    "categorie_id" INTEGER,
    "image_principale" VARCHAR(500),
    "statut" "StatutPublication" NOT NULL DEFAULT 'brouillon',
    "date_pub" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actualites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(50),
    "sujet" VARCHAR(255),
    "message" TEXT NOT NULL,
    "statut" "ContactStatut" NOT NULL DEFAULT 'nouveau',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "cle" VARCHAR(150) NOT NULL,
    "valeur" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255),
    "mime_type" VARCHAR(150),
    "size" INTEGER,
    "uploaded_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" "AuditAction" NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(50),
    "method" VARCHAR(10) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "status_code" INTEGER NOT NULL,
    "ip_address" VARCHAR(100),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_hash_key" ON "auth_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_idx" ON "auth_sessions"("user_id");

-- CreateIndex
CREATE INDEX "auth_sessions_expires_at_idx" ON "auth_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "partenaires_type_org_idx" ON "partenaires"("type_org");

-- CreateIndex
CREATE INDEX "photos_album_id_idx" ON "photos"("album_id");

-- CreateIndex
CREATE INDEX "press_book_photos_press_book_id_idx" ON "press_book_photos"("press_book_id");

-- CreateIndex
CREATE INDEX "press_book_videos_press_book_id_idx" ON "press_book_videos"("press_book_id");

-- CreateIndex
CREATE INDEX "prix_tendance_historiques_prix_tandance_id_idx" ON "prix_tendance_historiques"("prix_tandance_id");

-- CreateIndex
CREATE INDEX "prix_tendance_historiques_campagne_id_idx" ON "prix_tendance_historiques"("campagne_id");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_mail_key" ON "utilisateur"("mail");

-- CreateIndex
CREATE INDEX "utilisateur_role_id_idx" ON "utilisateur"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_nom_key" ON "categories"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "actualites_slug_key" ON "actualites"("slug");

-- CreateIndex
CREATE INDEX "actualites_categorie_id_idx" ON "actualites"("categorie_id");

-- CreateIndex
CREATE INDEX "actualites_statut_idx" ON "actualites"("statut");

-- CreateIndex
CREATE INDEX "contact_messages_statut_idx" ON "contact_messages"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_cle_key" ON "site_settings"("cle");

-- CreateIndex
CREATE INDEX "media_uploaded_by_idx" ON "media"("uploaded_by");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaires" ADD CONSTRAINT "partenaires_type_org_fkey" FOREIGN KEY ("type_org") REFERENCES "table_org"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "photo_albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_book_photos" ADD CONSTRAINT "press_book_photos_press_book_id_fkey" FOREIGN KEY ("press_book_id") REFERENCES "press_book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_book_videos" ADD CONSTRAINT "press_book_videos_press_book_id_fkey" FOREIGN KEY ("press_book_id") REFERENCES "press_book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prix_tendance_historiques" ADD CONSTRAINT "prix_tendance_historiques_prix_tandance_id_fkey" FOREIGN KEY ("prix_tandance_id") REFERENCES "prix_tendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prix_tendance_historiques" ADD CONSTRAINT "prix_tendance_historiques_campagne_id_fkey" FOREIGN KEY ("campagne_id") REFERENCES "campagnes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
