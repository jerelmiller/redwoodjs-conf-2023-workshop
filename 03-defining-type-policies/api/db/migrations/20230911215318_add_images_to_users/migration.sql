-- CreateTable
CREATE TABLE "_ImageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ImageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ImageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToUser_AB_unique" ON "_ImageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToUser_B_index" ON "_ImageToUser"("B");
