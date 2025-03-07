import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Round } from '@/types'
import { calculateStats, StatsData } from '@/utils/stats'
import { getUserStats, updateUserStats } from '@/services/statsService'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function StatsPage() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'all' | 'year' | 'month'>('all')
  const [scoreHistory, setScoreHistory] = useState<{ date: string; score: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      // Fetch rounds
      const { data: roundsData } = await supabase
        .from('rounds')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (roundsData) {
        setRounds(roundsData)
        
        // Calculate score history
        const history = roundsData.map(round => ({
          date: round.date,
          score: round.holes.reduce((total, hole) => 
            total + hole.shots.length + 
            hole.shots.reduce((acc, shot) => acc + (shot.penalty?.strokes || 0), 0)
          , 0)
        }))
        setScoreHistory(history)

        // Update stats in database and state
        const stats = await updateUserStats(user.id, roundsData)
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Loading stats...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Stats</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'all' | 'year' | 'month')}
            className="select select-bordered"
          >
            <option value="all">All Time</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {stats && (
          <div className="space-y-6">
            {/* Score History Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Score History</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* General Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">General Stats</h2>
                <div className="space-y-2">
                  <p>Rounds Played: {stats.roundsPlayed}</p>
                  <p>Scoring Average: {stats.scoringAverage.toFixed(1)}</p>
                  <p>Fairways: {stats.fairwayPercentage.toFixed(1)}%</p>
                  <p>Greens in Regulation: {stats.greenInRegulationPercentage.toFixed(1)}%</p>
                  <p>Average Putts: {stats.averagePutts.toFixed(1)}</p>
                  <p>Up & Down %: {stats.upAndDownPercentage.toFixed(1)}%</p>
                  <p>Penalties per Round: {stats.penaltiesPerRound.toFixed(1)}</p>
                </div>
              </div>

              {/* Approach Stats with Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Approach Stats</h2>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(stats.approachStats).map(([range, data]) => ({
                      range,
                      percentage: data.percentage
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#82ca9d" name="GIR %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.approachStats).map(([range, data]) => (
                    <div key={range} className="flex justify-between">
                      <span>{range} yards:</span>
                      <span>{data.percentage.toFixed(1)}% GIR ({data.greens}/{data.total})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Putting Stats with Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Putting Stats</h2>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(stats.puttingStats).map(([range, data]) => ({
                      range,
                      percentage: data.percentage
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#8884d8" name="Make %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.puttingStats).map(([range, data]) => (
                    <div key={range} className="flex justify-between">
                      <span>{range} feet:</span>
                      <span>{data.percentage.toFixed(1)}% ({data.made}/{data.total})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 