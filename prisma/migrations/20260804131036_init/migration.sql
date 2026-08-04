-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "MusicSource" AS ENUM ('UPLOAD', 'ITUNES');

-- CreateEnum
CREATE TYPE "MusicDuration" AS ENUM ('FIFTEEN', 'THIRTY', 'SIXTY');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "date_taken" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "caption" VARCHAR(500),
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" TEXT NOT NULL,
    "source" "MusicSource" NOT NULL,
    "file_url" TEXT,
    "file_public_id" TEXT,
    "itunes_track_id" TEXT,
    "preview_url" TEXT,
    "track_name" VARCHAR(200),
    "artist_name" VARCHAR(200),
    "album_name" VARCHAR(200),
    "album_art_url" TEXT,
    "start_time" INTEGER NOT NULL DEFAULT 0,
    "duration" "MusicDuration" NOT NULL DEFAULT 'THIRTY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" TEXT NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "display_name" VARCHAR(300) NOT NULL,
    "place_id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_slug_key" ON "Entry"("slug");

-- CreateIndex
CREATE INDEX "Entry_published_idx" ON "Entry"("published");

-- CreateIndex
CREATE INDEX "Entry_date_taken_idx" ON "Entry"("date_taken");

-- CreateIndex
CREATE INDEX "Entry_created_at_idx" ON "Entry"("created_at");

-- CreateIndex
CREATE INDEX "Entry_published_date_taken_idx" ON "Entry"("published", "date_taken");

-- CreateIndex
CREATE INDEX "Media_entry_id_idx" ON "Media"("entry_id");

-- CreateIndex
CREATE INDEX "Media_entry_id_order_idx" ON "Media"("entry_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Music_entry_id_key" ON "Music"("entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_entry_id_key" ON "Location"("entry_id");

-- CreateIndex
CREATE INDEX "Location_place_id_idx" ON "Location"("place_id");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
