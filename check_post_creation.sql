-- Check latest posts created
SELECT 
    id, 
    title, 
    status,
    "createdAt",
    "publishedAt"
FROM "Post" 
ORDER BY "createdAt" DESC 
LIMIT 5;

-- Check media assets with LIVESTREAM type
SELECT 
    ma.id,
    ma.type,
    ma.url,
    ma."muxPlaybackId",
    ma."muxAssetId",
    p.title as post_title
FROM "MediaAsset" ma
JOIN "Post" p ON ma."postId" = p.id
WHERE ma.type = 'LIVESTREAM'
ORDER BY ma."createdAt" DESC
LIMIT 5;

-- Check recent live streams
SELECT 
    id,
    title,
    "muxStreamId",
    "playbackId",
    "isLive",
    "createdAt"
FROM "LiveStream"
ORDER BY "createdAt" DESC
LIMIT 5;

