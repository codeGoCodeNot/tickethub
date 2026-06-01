/*
  Warnings:

  - Added the required column `userId` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "userId" TEXT NOT NULL;
