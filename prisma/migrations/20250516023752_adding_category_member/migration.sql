-- CreateEnum
CREATE TYPE "Category" AS ENUM ('REGULAR', 'WANITA', 'PELAJAR');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'REGULAR';
