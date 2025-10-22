// user-service/db/prisma.js
const { PrismaClient } = require('@prisma/client')

/**
 * Singleton Prisma client.
 * Keeps a single PrismaClient instance in development to avoid
 * exhausting database connections when nodemon/hot-reload restarts the app.
 *
 * This file also enables verbose Prisma logging during development so you can
 * see queries, warnings and errors in the service logs while debugging.
 */

const globalForPrisma = globalThis

// Create Prisma client with event-based logging enabled
const createPrismaClient = () =>
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  })

const prisma = globalForPrisma.__prisma || createPrismaClient()

// In development, attach to global so hot reloads reuse the same client
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma
}

/**
 * Prisma event listeners for observability.
 * These listeners log query text (with params), durations, info, warnings and errors.
 * This is intentionally verbose for debugging; remove or reduce in production as needed.
 */
prisma.$on('query', (e) => {
  try {
    // e.query can be long; e.params contains parameter array/string
    console.log(`[Prisma] Query (${e.duration}ms): ${e.query}`)
    if (e.params) console.log(`[Prisma] Params: ${e.params}`)
  } catch (err) {
    console.warn('[Prisma] Failed to log query event:', err)
  }
})

prisma.$on('info', (e) => {
  try {
    console.log('[Prisma][info]', e.message)
  } catch (err) {
    console.warn('[Prisma] Failed to log info event:', err)
  }
})

prisma.$on('warn', (e) => {
  try {
    console.warn('[Prisma][warn]', e.message)
  } catch (err) {
    console.warn('[Prisma] Failed to log warn event:', err)
  }
})

prisma.$on('error', (e) => {
  try {
    console.error('[Prisma][error]', e.message)
  } catch (err) {
    console.error('[Prisma] Failed to log error event:', err)
  }
})

module.exports = { prisma }
