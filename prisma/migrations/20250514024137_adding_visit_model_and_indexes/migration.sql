-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_memberId_visitedAt_idx" ON "Visit"("memberId", "visitedAt");

-- CreateIndex
CREATE INDEX "Member_id_expireDate_idx" ON "Member"("id", "expireDate");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
