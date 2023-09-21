-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "url" TEXT NOT NULL PRIMARY KEY,
    "height" INTEGER,
    "width" INTEGER
);
INSERT INTO "new_Image" ("height", "url", "width") SELECT "height", "url", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
