-- CreateTable
CREATE TABLE "PlaylistTracks" (
    "addedAt" DATETIME NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    PRIMARY KEY ("playlistId", "trackId")
);
