import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const router = useRouter()
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Redirect authenticated users based on their role
        const role = session.user?.user_metadata?.role
        if (role === 'player') {
          router.push('/dashboard')
        } else if (role === 'coach') {
          router.push('/coach')
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to MyTraqr</h1>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => router.push('/auth?role=player')}
            className="btn btn-primary w-64"
          >
            I'm a Player
          </button>
          <button
            onClick={() => router.push('/auth?role=coach')}
            className="btn btn-secondary w-64"
          >
            I'm a Coach
          </button>
        </div>
      </main>
    </div>
  )
} 