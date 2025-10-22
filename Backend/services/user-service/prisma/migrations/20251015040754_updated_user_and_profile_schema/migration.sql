/*
  Warnings:

  - You are about to drop the `CreatorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CreatorProfile" DROP CONSTRAINT "CreatorProfile_userId_fkey";

-- DropTable
DROP TABLE "public"."CreatorProfile";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."creator_profiles" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "youtubeUrl" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "facebookUrl" TEXT,
    "twitchUrl" TEXT,
    "tiktokUrl" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_pageUrl_key" ON "public"."creator_profiles"("pageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_userId_key" ON "public"."creator_profiles"("userId");

-- AddForeignKey
ALTER TABLE "public"."creator_profiles" ADD CONSTRAINT "creator_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
