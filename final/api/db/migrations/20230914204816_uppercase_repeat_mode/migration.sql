-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaybackState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "repeatMode" TEXT NOT NULL DEFAULT 'OFF',
    "shuffled" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    CONSTRAINT "PlaybackState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaybackState_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaybackState" ("deviceId", "id", "isPlaying", "repeatMode", "shuffled", "userId") SELECT "deviceId", "id", "isPlaying", "repeatMode", "shuffled", "userId" FROM "PlaybackState";
DROP TABLE "PlaybackState";
ALTER TABLE "new_PlaybackState" RENAME TO "PlaybackState";
CREATE UNIQUE INDEX "PlaybackState_userId_key" ON "PlaybackState"("userId");
CREATE UNIQUE INDEX "PlaybackState_deviceId_key" ON "PlaybackState"("deviceId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
