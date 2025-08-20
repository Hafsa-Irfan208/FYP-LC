-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "plagiarismPassed" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "plagiarismChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plagiarismReport" TEXT,
ADD COLUMN     "plagiarismScore" DOUBLE PRECISION;
