-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "trackNumber" INTEGER NOT NULL,
    CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
