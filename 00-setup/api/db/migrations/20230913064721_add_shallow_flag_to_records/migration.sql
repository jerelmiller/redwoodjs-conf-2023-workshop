-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "albumType" TEXT NOT NULL DEFAULT 'album',
    "releaseDate" TEXT NOT NULL,
    "releaseDatePrecision" TEXT NOT NULL,
    "shallow" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Album" ("albumType", "id", "name", "releaseDate", "releaseDatePrecision") SELECT "albumType", "id", "name", "releaseDate", "releaseDatePrecision" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE TABLE "new_Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "durationMs" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "trackNumber" INTEGER NOT NULL,
    "shallow" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("albumId", "discNumber", "durationMs", "explicit", "id", "name", "popularity", "trackNumber") SELECT "albumId", "discNumber", "durationMs", "explicit", "id", "name", "popularity", "trackNumber" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
CREATE TABLE "new_Artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "shallow" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Artist" ("followerCount", "id", "name") SELECT "followerCount", "id", "name" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
