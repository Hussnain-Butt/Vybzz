import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

// Dummy authentication function
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    fakeAuth.isAuthenticated = true
    setTimeout(cb, 100) // Simulate async call
  },
  signout(cb: () => void) {
    fakeAuth.isAuthenticated = false
    setTimeout(cb, 100)
  },
}

// Exporting for use in other components
export { fakeAuth }

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // GSAP Animation for the login form
    gsap.fromTo(
      '.login-container',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    )
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@example.com' && password === 'password') {
      fakeAuth.authenticate(() => {
        // Is line ko update karein
        navigate('/admin-dashboard')
      })
    } else {
      setError('Invalid credentials. Please try again.')
      gsap.fromTo(
        '.error-message',
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1, clearProps: 'x' },
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background-dark))] p-4">
      <div className="login-container w-full max-w-md p-8 space-y-6 bg-[rgb(var(--color-surface-1))] rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">Admin Access</h1>
          <p className="text-[rgb(var(--color-text-muted))] mt-2">Sign in to manage the platform</p>
        </div>

        {error && (
          <div className="error-message p-3 text-center text-sm font-medium text-white bg-red-500/50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[rgb(var(--color-text-secondary))]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 block w-full px-4 py-3 bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-surface-3))] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[rgb(var(--color-text-secondary))]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="mt-1 block w-full px-4 py-3 bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-surface-3))] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[rgb(var(--color-primary-cyan))] hover:bg-sky-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface-1))] focus:ring-[rgb(var(--color-primary-cyan))]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
