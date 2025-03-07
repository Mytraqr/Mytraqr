import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Course, Round, Shot, Hole } from '@/types'

export default function NewRound() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentHole, setCurrentHole] = useState(1)
  const [round, setRound] = useState<Partial<Round>>({
    date: new Date().toISOString().split('T')[0],
    condition: 'good',
    holes: []
  })

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: userCourses } = await supabase
        .from('courses')
        .select('*')
      
      if (userCourses) {
        setCourses(userCourses)
      }
    }

    fetchCourses()
  }, [])

  const handleShotSubmit = (shot: Shot) => {
    setRound(prev => {
      const holes = [...(prev.holes || [])]
      const currentHoleData = holes[currentHole - 1] || { 
        number: currentHole,
        par: selectedCourse?.holes[currentHole - 1].par || 4,
        shots: []
      }
      
      currentHoleData.shots = [...currentHoleData.shots, shot]
      holes[currentHole - 1] = currentHoleData

      return { ...prev, holes }
    })

    if (shot.type === 'putt' && currentHole < 18) {
      setCurrentHole(prev => prev + 1)
    }
  }

  const handleFinishRound = async () => {
    if (!selectedCourse) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('rounds')
        .insert({
          ...round,
          user_id: user.id,
          course_id: selectedCourse.id
        })
        .select()
        .single()

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving round:', error)
      alert('Failed to save round')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">New Round</h1>
        
        {/* Course Selection */}
        {!selectedCourse ? (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl mb-4">Select Course</h2>
            <div className="grid gap-4">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="btn btn-outline w-full text-left"
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Round Details */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl mb-4">Round Details</h2>
              <div className="grid gap-4">
                <input
                  type="date"
                  value={round.date}
                  onChange={e => setRound(prev => ({ ...prev, date: e.target.value }))}
                  className="input input-bordered"
                />
                <select
                  value={round.condition}
                  onChange={e => setRound(prev => ({ ...prev, condition: e.target.value as Round['condition'] }))}
                  className="select select-bordered"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
            </div>

            {/* Shot Entry */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl mb-4">Hole {currentHole}</h2>
              <ShotEntry onSubmit={handleShotSubmit} />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentHole(prev => Math.max(1, prev - 1))}
                disabled={currentHole === 1}
                className="btn"
              >
                Previous Hole
              </button>
              {currentHole === 18 ? (
                <button
                  onClick={handleFinishRound}
                  className="btn btn-primary"
                >
                  Finish Round
                </button>
              ) : (
                <button
                  onClick={() => setCurrentHole(prev => Math.min(18, prev + 1))}
                  className="btn"
                >
                  Next Hole
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// We'll create this component next
function ShotEntry({ onSubmit }: { onSubmit: (shot: Shot) => void }) {
  // Implementation coming next...
  return null
} 