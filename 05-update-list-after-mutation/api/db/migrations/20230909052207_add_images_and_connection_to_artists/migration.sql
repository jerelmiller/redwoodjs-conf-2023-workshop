-- CreateTable
CREATE TABLE "ArtistImage" (
    "artistId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    PRIMARY KEY ("artistId", "imageUrl"),
    CONSTRAINT "ArtistImage_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtistImage_imageUrl_fkey" FOREIGN KEY ("imageUrl") REFERENCES "Image" ("url") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "url" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");
