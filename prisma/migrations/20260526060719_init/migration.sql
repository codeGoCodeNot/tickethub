-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'PENDING';
