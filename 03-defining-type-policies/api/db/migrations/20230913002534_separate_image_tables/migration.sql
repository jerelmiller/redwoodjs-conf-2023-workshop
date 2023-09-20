/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AlbumToImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistToImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageToPlaylist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Image";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AlbumToImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ArtistToImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ImageToPlaylist";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ImageToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ArtistImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "artistId" TEXT NOT NULL,
    CONSTRAINT "ArtistImage_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlbumImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "albumId" TEXT NOT NULL,
    CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlaylistImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "playlistId" TEXT NOT NULL,
    CONSTRAINT "PlaylistImage_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistImage_url_key" ON "ArtistImage"("url");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumImage_url_key" ON "AlbumImage"("url");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistImage_url_key" ON "PlaylistImage"("url");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_url_key" ON "UserImage"("url");
