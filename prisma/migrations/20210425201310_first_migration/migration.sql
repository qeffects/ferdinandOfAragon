-- CreateTable
CREATE TABLE "BotConfig" (
    "guild" TEXT NOT NULL PRIMARY KEY,
    "language" DECIMAL NOT NULL DEFAULT 0,
    "inquisition_status" DECIMAL NOT NULL DEFAULT 0,
    "inquisition_channel" TEXT,
    "inquisition_role" TEXT,
    "inquisition_target" TEXT,
    "inquisition_question_submit_link" TEXT
);

-- CreateTable
CREATE TABLE "InquisitionQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT (datetime('now'))
);