/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "createdAt",
DROP COLUMN "key",
DROP COLUMN "mimetype",
DROP COLUMN "name",
DROP COLUMN "size",
DROP COLUMN "url",
DROP COLUMN "userId",
ADD COLUMN     "filename" TEXT NOT NULL;
