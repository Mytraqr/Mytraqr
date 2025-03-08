import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const { role, isSignUp } = router.query
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSignUp, setShowSignUp] = useState(isSignUp === 'true')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (showSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role || 'player'
            }
          }
        })
        
        if (error) throw error
        
        alert('Check your email for the confirmation link!')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message || 'An error occurred during authentication')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {showSignUp ? 'Create Account' : 'Sign In'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            {showSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={() => setShowSignUp(!showSignUp)}
          className="mt-4 text-sm text-blue-600 hover:underline w-full text-center"
        >
          {showSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  )
} 