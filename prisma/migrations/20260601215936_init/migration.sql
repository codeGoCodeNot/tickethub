/*
  Warnings:

  - The `action` column on the `ActivityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('ticket_created', 'ticket_updated', 'ticket_status_changed', 'ticket_approved', 'ticket_rejected', 'ticket_removed', 'comment_created', 'comment_updated', 'comment_deleted', 'attachment_uploaded', 'attachment_deleted');

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "action",
ADD COLUMN     "action" "ActivityAction" NOT NULL DEFAULT 'ticket_created';
