-- Add processed field to LiveStream table to prevent duplicate post creation
-- This migration adds a boolean field to track if a VOD post has been created for this stream

ALTER TABLE "LiveStream" 
ADD COLUMN IF NOT EXISTS "processed" BOOLEAN NOT NULL DEFAULT false;

-- Update existing streams to be marked as processed (to avoid recreating posts for old streams)
-- Comment this line if you want to process existing streams
-- UPDATE "LiveStream" SET "processed" = true WHERE "isLive" = false;

