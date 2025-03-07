import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Round, User } from '@/types'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [recentRounds, setRecentRounds] = useState<Round[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth')
        return
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(profile)

      // Fetch recent rounds
      const { data: rounds } = await supabase
        .from('rounds')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date', { ascending: false })
        .limit(5)

      setRecentRounds(rounds || [])
    }

    fetchUserData()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Golf Traqr</h1>
          <div className="space-x-4">
            <button onClick={() => router.push('/round/new')} className="btn btn-primary">
              New Round
            </button>
            <button onClick={() => router.push('/settings')} className="btn btn-ghost">
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Rounds</h2>
            {recentRounds.length > 0 ? (
              <ul className="space-y-4">
                {recentRounds.map((round) => (
                  <li key={round.id} className="border-b pb-2">
                    <p className="font-semibold">{new Date(round.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Course: {round.course_id}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No rounds recorded yet</p>
            )}
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            {/* Add quick stats here */}
          </section>
        </div>
      </main>
    </div>
  )
} 