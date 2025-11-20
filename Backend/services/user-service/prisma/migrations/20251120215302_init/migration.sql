-- CreateTable
CREATE TABLE "users"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."CreatorProfile" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "profileImageUrl" TEXT,
    "bannerUrl" TEXT,
    "bio" TEXT,
    "onboardingStep" INTEGER NOT NULL DEFAULT 2,
    "youtubeUrl" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "facebookUrl" TEXT,
    "twitchUrl" TEXT,
    "tiktokUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "users"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "users"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "users"."User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "users"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_pageName_key" ON "users"."CreatorProfile"("pageName");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_pageUrl_key" ON "users"."CreatorProfile"("pageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "users"."CreatorProfile"("userId");

-- AddForeignKey
ALTER TABLE "users"."CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
