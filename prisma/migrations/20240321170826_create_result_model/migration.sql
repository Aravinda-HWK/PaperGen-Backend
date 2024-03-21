-- CreateTable
CREATE TABLE "result" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "paperId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" TEXT[],

    CONSTRAINT "result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
