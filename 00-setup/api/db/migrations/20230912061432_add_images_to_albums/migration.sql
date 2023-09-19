-- CreateTable
CREATE TABLE "_AlbumToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AlbumToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlbumToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToImage_AB_unique" ON "_AlbumToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToImage_B_index" ON "_AlbumToImage"("B");
