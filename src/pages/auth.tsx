import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const { role } = router.query
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
              preferences: { units: 'yards' }
            }
          }
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
      }

      // Redirect based on role
      if (role === 'player') {
        router.push('/dashboard')
      } else {
        router.push('/coach')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-sm text-blue-600 hover:underline w-full text-center"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  )
} 