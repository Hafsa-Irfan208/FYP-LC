/*
  Warnings:

  - Added the required column `questionNumber` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourcecode` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "questionNumber" INTEGER NOT NULL,
ADD COLUMN     "sourcecode" TEXT NOT NULL;
