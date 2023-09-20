-- CreateTable
CREATE TABLE "Copyright" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Copyright_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Copyright_albumId_text_type_key" ON "Copyright"("albumId", "text", "type");
