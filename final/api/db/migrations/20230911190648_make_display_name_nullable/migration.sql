-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT
);
INSERT INTO "new_User" ("displayName", "id") SELECT "displayName", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
