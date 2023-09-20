/*
  Warnings:

  - Added the required column `releaseDate` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDatePrecision` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "albumType" TEXT NOT NULL DEFAULT 'album',
    "releaseDate" TEXT NOT NULL,
    "releaseDatePrecision" TEXT NOT NULL
);
INSERT INTO "new_Album" ("albumType", "id", "name") SELECT "albumType", "id", "name" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
