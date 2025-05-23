-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "imageId" TEXT;

-- CreateIndex
CREATE INDEX "Notifications_createdAt_id_idx" ON "Notifications"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Payment_memberId_paymentAt_idx" ON "Payment"("memberId", "paymentAt");
