-- CreateEnum
CREATE TYPE "StripeSubscriptionStatus" AS ENUM ('active', 'incomplete', 'incomplete_expired', 'past_due', 'canceled', 'unpaid', 'trialing', 'paused');

-- AlterTable
ALTER TABLE "StripeCustomer" ADD COLUMN     "priceId" TEXT,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" "StripeSubscriptionStatus";
