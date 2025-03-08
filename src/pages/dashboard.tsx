import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    
    checkUser()
  }, [])

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
          <h1 className="text-xl font-bold">MyTraqr</h1>
          <div className="space-x-4">
            <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to MyTraqr</h1>
        <p>Your golf tracking journey starts here!</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Quick Start</h2>
            <ul className="space-y-2">
              <li>• Track your first round</li>
              <li>• Add your favorite courses</li>
              <li>• Connect with a coach</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Stats</h2>
            <p>No rounds recorded yet. Start tracking to see your stats!</p>
          </div>
        </div>
      </main>
    </div>
  )
} 