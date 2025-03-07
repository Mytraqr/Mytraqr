import { supabase } from '@/lib/supabase'
import { Round, Shot } from '@/types'
import { calculateStats, StatsData } from '@/utils/stats'

export async function updateUserStats(userId: string, rounds: Round[]) {
  const stats = calculateStats(rounds)
  
  // Store different time period stats
  const periods = {
    all: rounds,
    year: rounds.filter(r => {
      const roundDate = new Date(r.date)
      const yearAgo = new Date()
      yearAgo.setFullYear(yearAgo.getFullYear() - 1)
      return roundDate >= yearAgo
    }),
    month: rounds.filter(r => {
      const roundDate = new Date(r.date)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return roundDate >= monthAgo
    })
  }

  // Update stats for each period
  for (const [period, periodRounds] of Object.entries(periods)) {
    const periodStats = calculateStats(periodRounds)
    
    const { error } = await supabase
      .from('stats')
      .upsert({
        user_id: userId,
        period,
        stats_type: 'golf',
        data: periodStats
      }, {
        onConflict: 'user_id,period,stats_type'
      })

    if (error) {
      console.error(`Error updating ${period} stats:`, error)
    }
  }

  return stats
}

export async function getUserStats(userId: string, period: 'all' | 'year' | 'month' = 'all'): Promise<StatsData | null> {
  const { data, error } = await supabase
    .from('stats')
    .select('data')
    .eq('user_id', userId)
    .eq('period', period)
    .eq('stats_type', 'golf')
    .single()

  if (error || !data) {
    console.error('Error fetching stats:', error)
    return null
  }

  return data.data as StatsData
} 