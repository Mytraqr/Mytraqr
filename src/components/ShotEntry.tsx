import { useState } from 'react'
import { Shot, ShotResult, Direction, HazardType } from '@/types'

interface ShotEntryProps {
  onSubmit: (shot: Shot) => void
}

export default function ShotEntry({ onSubmit }: ShotEntryProps) {
  const [shotType, setShotType] = useState<Shot['type']>('tee')
  const [club, setClub] = useState('')
  const [distance, setDistance] = useState('')
  const [result, setResult] = useState<ShotResult>('fairway')
  const [direction, setDirection] = useState<Direction>('left')
  const [lie, setLie] = useState('')
  const [showPenalty, setShowPenalty] = useState(false)
  const [penaltyType, setPenaltyType] = useState<HazardType>('water')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const shot: Shot = {
      type: shotType,
      result,
      ...(club && { club }),
      ...(distance && { distance: parseInt(distance, 10) }),
      ...(direction && result !== 'fairway' && { direction }),
      ...(lie && { lie }),
      ...(showPenalty && {
        penalty: {
          type: penaltyType,
          strokes: penaltyType === 'ob' ? 2 : 1
        }
      })
    }

    onSubmit(shot)
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Shot Entry</h2>
      <p>This is a placeholder for the shot entry component.</p>
    </div>
  )
} 