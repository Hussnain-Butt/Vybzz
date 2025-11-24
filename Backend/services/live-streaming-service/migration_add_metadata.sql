-- Migration: Add tags and thumbnailUrl to LiveStream table
-- Run this in your PostgreSQL database for live-streaming-service

-- Add tags column (array of text)
ALTER TABLE "LiveStream" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';

-- Add thumbnailUrl column
ALTER TABLE "LiveStream" ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'LiveStream' 
AND column_name IN ('tags', 'thumbnailUrl');

