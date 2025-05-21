-- CreateEnum
CREATE TYPE "Read" AS ENUM ('READ', 'UNREAD');

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "readStatus" "Read" NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);
