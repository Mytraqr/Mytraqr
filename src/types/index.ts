export type UserRole = 'player' | 'coach'

export interface User {
  id: string
  email: string
  role: 'player' | 'coach'
  name?: string
  coach_id?: string
  pairing_code?: string
  preferences: {
    units: 'yards' | 'meters'
  }
}

export interface Course {
  id: string
  user_id: string
  name: string
  holes: Hole[]
  created_at: string
}

export interface Hole {
  number: number
  par: number
  yardage: number
}

export interface Round {
  id: string
  user_id: string
  course_id: string
  date: string
  condition: 'poor' | 'fair' | 'good' | 'excellent'
  holes: HoleData[]
  created_at: string
}

export interface HoleData {
  number: number
  par: number
  shots: Shot[]
}

export interface Shot {
  type: 'tee' | 'approach' | 'greenside' | 'putt'
  result: ShotResult
  club?: string
  distance?: number
  direction?: Direction
  lie?: string
  penalty?: {
    type: HazardType
    strokes: number
  }
}

export type ShotResult = 'fairway' | 'rough' | 'bunker' | 'hazard' | 'green'
export type Direction = 'left' | 'right'
export type HazardType = 'water' | 'ob' | 'unplayable'
export type Condition = 'poor' | 'fair' | 'good' | 'excellent' 