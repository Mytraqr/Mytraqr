import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Course } from '@/types'

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [showNewCourse, setShowNewCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({
    name: '',
    holes: Array(18).fill(null).map((_, i) => ({
      number: i + 1,
      par: 4,
      yardage: 400
    }))
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data: userCourses } = await supabase
      .from('courses')
      .select('*')
      .order('name')
    
    if (userCourses) {
      setCourses(userCourses)
    }
  }

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...newCourse,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      setCourses([...courses, data])
      setShowNewCourse(false)
      setNewCourse({
        name: '',
        holes: Array(18).fill(null).map((_, i) => ({
          number: i + 1,
          par: 4,
          yardage: 400
        }))
      })
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Failed to save course')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <button
            onClick={() => setShowNewCourse(true)}
            className="btn btn-primary"
          >
            Add New Course
          </button>
        </div>

        {showNewCourse ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">New Course</h2>
            <form onSubmit={handleSaveCourse} className="space-y-6">
              <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="input input-bordered w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newCourse.holes.map((hole, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h3 className="font-bold mb-2">Hole {hole.number}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm">Par</label>
                        <input
                          type="number"
                          value={hole.par}
                          onChange={(e) => {
                            const holes = [...newCourse.holes]
                            holes[index] = {
                              ...hole,
                              par: parseInt(e.target.value, 10)
                            }
                            setNewCourse({ ...newCourse, holes })
                          }}
                          className="input input-bordered w-full"
                          min="3"
                          max="5"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Yardage</label>
                        <input
                          type="number"
                          value={hole.yardage}
                          onChange={(e) => {
                            const holes = [...newCourse.holes]
                            holes[index] = {
                              ...hole,
                              yardage: parseInt(e.target.value, 10)
                            }
                            setNewCourse({ ...newCourse, holes })
                          }}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewCourse(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Course
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid gap-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold">{course.name}</h2>
                <p className="text-gray-600">
                  {course.holes.length} holes
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 