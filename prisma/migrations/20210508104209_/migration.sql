-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotConfig" (
    "guild" TEXT NOT NULL PRIMARY KEY,
    "language" DECIMAL NOT NULL DEFAULT 0,
    "inquisition_status" DECIMAL NOT NULL DEFAULT 0,
    "inquisition_channel" TEXT,
    "inquisition_role" TEXT,
    "inquisition_target" TEXT,
    "inquisition_question_submit_link" TEXT,
    "quick_inquisition_status" DECIMAL NOT NULL DEFAULT 0
);
INSERT INTO "new_BotConfig" ("guild", "language", "inquisition_status", "inquisition_channel", "inquisition_role", "inquisition_target", "inquisition_question_submit_link") SELECT "guild", "language", "inquisition_status", "inquisition_channel", "inquisition_role", "inquisition_target", "inquisition_question_submit_link" FROM "BotConfig";
DROP TABLE "BotConfig";
ALTER TABLE "new_BotConfig" RENAME TO "BotConfig";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
