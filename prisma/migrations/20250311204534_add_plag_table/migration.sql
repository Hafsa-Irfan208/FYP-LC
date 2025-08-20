/*
  Warnings:

  - You are about to drop the column `plagiarismChecked` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `plagiarismReport` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `plagiarismScore` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "plagiarismChecked",
DROP COLUMN "plagiarismReport",
DROP COLUMN "plagiarismScore";

-- CreateTable
CREATE TABLE "PlagiarismCheck" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "plagiarismScore" DOUBLE PRECISION NOT NULL,
    "plagiarismReport" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlagiarismCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlagiarismCheck_submissionId_key" ON "PlagiarismCheck"("submissionId");

-- AddForeignKey
ALTER TABLE "PlagiarismCheck" ADD CONSTRAINT "PlagiarismCheck_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
