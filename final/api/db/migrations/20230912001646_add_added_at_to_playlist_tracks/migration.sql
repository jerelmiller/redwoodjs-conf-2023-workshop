/*
  Warnings:

  - Added the required column `addedById` to the `PlaylistTrack` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaylistTrack" (
    "addedAt" DATETIME NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,

    PRIMARY KEY ("playlistId", "trackId"),
    CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistTrack_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaylistTrack" ("addedAt", "playlistId", "trackId") SELECT "addedAt", "playlistId", "trackId" FROM "PlaylistTrack";
DROP TABLE "PlaylistTrack";
ALTER TABLE "new_PlaylistTrack" RENAME TO "PlaylistTrack";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
