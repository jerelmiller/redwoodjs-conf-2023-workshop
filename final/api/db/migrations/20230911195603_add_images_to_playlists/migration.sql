-- CreateTable
CREATE TABLE "_ImageToPlaylist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ImageToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ImageToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToPlaylist_AB_unique" ON "_ImageToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToPlaylist_B_index" ON "_ImageToPlaylist"("B");
