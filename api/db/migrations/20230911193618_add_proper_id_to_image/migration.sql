/*
  Warnings:

  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ArtistImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `ArtistImage` table. All the data in the column will be lost.
  - The required column `id` was added to the `Image` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `imageId` to the `ArtistImage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER
);
INSERT INTO "new_Image" ("height", "url", "width") SELECT "height", "url", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");
CREATE TABLE "new_ArtistImage" (
    "artistId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    PRIMARY KEY ("artistId", "imageId"),
    CONSTRAINT "ArtistImage_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtistImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ArtistImage" ("artistId") SELECT "artistId" FROM "ArtistImage";
DROP TABLE "ArtistImage";
ALTER TABLE "new_ArtistImage" RENAME TO "ArtistImage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
