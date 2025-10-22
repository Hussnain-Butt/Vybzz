-- AlterTable
ALTER TABLE "public"."CreatorProfile" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "profileImageUrl" TEXT;
