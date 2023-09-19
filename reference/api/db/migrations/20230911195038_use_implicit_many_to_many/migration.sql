/*
  Warnings:

  - You are about to drop the `ArtistImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtistImage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_ArtistToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ArtistToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArtistToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToImage_AB_unique" ON "_ArtistToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToImage_B_index" ON "_ArtistToImage"("B");
