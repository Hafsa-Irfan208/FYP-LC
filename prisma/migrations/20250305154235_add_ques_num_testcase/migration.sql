/*
  Warnings:

  - Added the required column `questionNumber` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "questionNumber" INTEGER NOT NULL;
