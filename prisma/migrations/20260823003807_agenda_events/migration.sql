-- AlterTable
ALTER TABLE "agenda" ADD COLUMN     "heure_deb" VARCHAR(10),
ADD COLUMN     "heure_fin" VARCHAR(10),
ADD COLUMN     "infos_pratiques" TEXT,
ADD COLUMN     "statut" "StatutPublication" NOT NULL DEFAULT 'brouillon';

-- CreateTable
CREATE TABLE "agenda_images" (
    "id" SERIAL NOT NULL,
    "agenda_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agenda_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_documents" (
    "id" SERIAL NOT NULL,
    "agenda_id" INTEGER NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agenda_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agenda_images_agenda_id_idx" ON "agenda_images"("agenda_id");

-- CreateIndex
CREATE INDEX "agenda_documents_agenda_id_idx" ON "agenda_documents"("agenda_id");

-- CreateIndex
CREATE INDEX "agenda_statut_idx" ON "agenda"("statut");

-- AddForeignKey
ALTER TABLE "agenda_images" ADD CONSTRAINT "agenda_images_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_documents" ADD CONSTRAINT "agenda_documents_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
