/*
  Warnings:

  - You are about to drop the `PlaylistTracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlaylistTracks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "addedAt" DATETIME NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    PRIMARY KEY ("playlistId", "trackId"),
    CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
