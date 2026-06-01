/*
  Warnings:

  - The values [ticket_created,ticket_updated,ticket_status_changed,ticket_approved,ticket_rejected,ticket_removed,comment_created,comment_updated,comment_deleted,attachment_uploaded,attachment_deleted] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('ticket.created', 'ticket.updated', 'ticket.status_changed', 'ticket.approved', 'ticket.rejected', 'ticket.removed', 'comment.created', 'comment.updated', 'comment.deleted', 'attachment.uploaded', 'attachment.deleted');
ALTER TABLE "ActivityLog" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "public"."ActivityAction_old";
COMMIT;
