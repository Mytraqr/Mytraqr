import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function CoachDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signin')
      } else {
        // Verify this is a coach
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (data?.role !== 'coach') {
          router.push('/dashboard')
        } else {
          setUser(user)
          setLoading(false)
        }
      }
    }
    
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">MyTraqr Coach</h1>
          <div className="space-x-4">
            <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Coach Dashboard</h1>
        <p>Welcome to your coaching dashboard!</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Players</h2>
            <p>No players yet. Share your coach code to connect with players.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Coach Code</h2>
            <p>Your unique coach code: <strong>COACH123</strong></p>
            <p className="text-sm text-gray-600 mt-2">Share this code with your players to connect.</p>
          </div>
        </div>
      </main>
    </div>
  )
} 