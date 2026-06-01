-- CreateEnum
CREATE TYPE "AttachmentEntity" AS ENUM ('TICKET', 'COMMENT');

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "entity" "AttachmentEntity" NOT NULL DEFAULT 'TICKET',
ALTER COLUMN "ticketId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Attachment_commentId_idx" ON "Attachment"("commentId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
