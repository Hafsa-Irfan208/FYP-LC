/*
  Warnings:

  - You are about to drop the column `matchedSource` on the `PlagiarismCheck` table. All the data in the column will be lost.
  - You are about to drop the column `matchedText` on the `PlagiarismCheck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlagiarismCheck" DROP COLUMN "matchedSource",
DROP COLUMN "matchedText";
