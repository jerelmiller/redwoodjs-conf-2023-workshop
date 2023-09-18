-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "durationMs" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "trackNumber" INTEGER NOT NULL,
    CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("albumId", "durationMs", "explicit", "id", "name", "popularity", "trackNumber") SELECT "albumId", "durationMs", "explicit", "id", "name", "popularity", "trackNumber" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
