-- AlterTable
ALTER TABLE "PlagiarismCheck" ADD COLUMN     "matchedSource" TEXT,
ADD COLUMN     "matchedText" TEXT,
ALTER COLUMN "plagiarismScore" DROP NOT NULL;
