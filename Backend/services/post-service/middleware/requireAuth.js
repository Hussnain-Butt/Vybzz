// /middleware/requireAuth.js
// Single-file middleware that:
// 1) runs Clerk's clerkMiddleware() to populate request auth data,
// 2) checks for authenticated user via getAuth(),
// 3) returns 401 JSON when unauthenticated or on Clerk errors,
// 4) attaches req.userId for downstream handlers.
//
// Usage (ke tum already kar rahe ho): const { requireAuth } = require('../middleware/requireAuth')
// and then router.use(requireAuth)

const { clerkMiddleware, getAuth } = require('@clerk/express')

const clerkMw = clerkMiddleware()

function requireAuth(req, res, next) {
  // First run Clerk's middleware to populate request auth context
  // We call the middleware function directly and handle its callback.
  clerkMw(req, res, (err) => {
    if (err) {
      // Clerk middleware produced an error (e.g. invalid token); return 401
      console.error('Clerk middleware error:', err)
      return res.status(401).json({ error: 'Not authenticated or invalid token.' })
    }

    // Read auth using getAuth()
    const auth = getAuth(req) || {}
    const userId = auth.userId

    if (!userId) {
      // No authenticated user found
      return res.status(401).json({ error: 'Not authenticated.' })
    }

    // Attach userId to request for convenience in downstream handlers
    req.userId = userId
    // Optionally attach the full auth object
    req.auth = auth

    return next()
  })
}

module.exports = { requireAuth }
