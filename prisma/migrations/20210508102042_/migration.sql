-- CreateTable
CREATE TABLE "QuickQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
