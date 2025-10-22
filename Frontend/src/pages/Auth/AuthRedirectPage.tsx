// src/pages/Auth/AuthRedirectPage.tsx (COMPLETE UPDATED CODE WITH LOGGING)
import React, { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { getCurrentUser } from '../../api/apiClient'

const AuthRedirectPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const hasRun = useRef(false)

  useEffect(() => {
    console.log('[AuthRedirectPage] useEffect triggered.')
    console.log(`[AuthRedirectPage] Status -> isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}`)

    if (!isLoaded) {
      console.log('[AuthRedirectPage] Clerk is not loaded yet. Waiting...')
      return
    }

    const checkUserStatusAndRedirect = async () => {
      console.log('[AuthRedirectPage] checkUserStatusAndRedirect function started.')

      // Gate check
      if (hasRun.current) {
        console.log('[AuthRedirectPage] Logic has already run. Aborting to prevent loop.')
        return
      }
      hasRun.current = true
      console.log('[AuthRedirectPage] Redirection gate is now closed.')

      // Check sign-in status again inside the async function
      if (!isSignedIn) {
        console.log('[AuthRedirectPage] User is not signed in. Redirecting to /login.')
        navigate('/login', { replace: true })
        return
      }

      const intentFromStorage = sessionStorage.getItem('authIntent')
      const intendedRole = intentFromStorage || searchParams.get('role')
      console.log(`[AuthRedirectPage] User intent (role): ${intendedRole}`)

      if (intentFromStorage) {
        sessionStorage.removeItem('authIntent')
      }

      try {
        console.log('[AuthRedirectPage] Calling getCurrentUser()...')
        const userData = await getCurrentUser()
        console.log('[AuthRedirectPage] SUCCESS: Received userData:', userData)

        console.log('[AuthRedirectPage] Caching user data in React Query.')
        queryClient.setQueryData('currentUser', userData)

        const isExistingActiveCreator = !!(
          userData?.creatorProfile && userData.creatorProfile.status === 'ACTIVE'
        )
        console.log(`[AuthRedirectPage] Is existing active creator? ${isExistingActiveCreator}`)

        if (isExistingActiveCreator) {
          console.log('[AuthRedirectPage] Navigating to /dashboard.')
          navigate('/dashboard', { replace: true })
        } else if (intendedRole === 'creator') {
          console.log('[AuthRedirectPage] Navigating to /creator/setup.')
          navigate('/creator/setup', { replace: true })
        } else {
          console.log('[AuthRedirectPage] Navigating to /member/home.')
          navigate('/member/home', { replace: true })
        }
      } catch (error) {
        console.error('--- !!! CRITICAL ERROR IN AuthRedirectPage !!! ---')
        console.error(error)
        console.log('[AuthRedirectPage] Fallback: Navigating to /member/home due to error.')
        navigate('/member/home', { replace: true })
      }
    }

    // Only run the logic once Clerk is loaded
    checkUserStatusAndRedirect()
  }, [isLoaded, isSignedIn, navigate, searchParams, queryClient])

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] flex items-center justify-center">
      <p className="text-white text-lg animate-pulse">Finalizing your login, please wait...</p>
    </div>
  )
}

export default AuthRedirectPage
