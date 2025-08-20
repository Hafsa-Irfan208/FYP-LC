/*
  Warnings:

  - You are about to drop the column `correctAnswers` on the `AssignmentResult` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AssignmentResult` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuestions` on the `AssignmentResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssignmentResult" DROP COLUMN "correctAnswers",
DROP COLUMN "createdAt",
DROP COLUMN "totalQuestions";
