/*
  Warnings:

  - You are about to drop the column `repeatState` on the `PlaybackState` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaybackState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "repeatMode" TEXT NOT NULL DEFAULT 'off',
    "shuffled" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PlaybackState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaybackState" ("id", "isPlaying", "shuffled", "userId") SELECT "id", "isPlaying", "shuffled", "userId" FROM "PlaybackState";
DROP TABLE "PlaybackState";
ALTER TABLE "new_PlaybackState" RENAME TO "PlaybackState";
CREATE UNIQUE INDEX "PlaybackState_userId_key" ON "PlaybackState"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
