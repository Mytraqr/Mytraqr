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
    resetForm()
  }

  const resetForm = () => {
    if (shotType === 'tee') {
      setShotType('approach')
    } else if (shotType === 'approach' && result === 'green') {
      setShotType('putt')
    } else if (result !== 'green') {
      setShotType('approach')
    }
    
    setClub('')
    setDistance('')
    setResult('fairway')
    setDirection('left')
    setLie('')
    setShowPenalty(false)
    setPenaltyType('water')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <select
          value={shotType}
          onChange={(e) => setShotType(e.target.value as Shot['type'])}
          className="select select-bordered w-full"
        >
          <option value="tee">Tee Shot</option>
          <option value="approach">Approach Shot</option>
          <option value="greenside">Greenside Shot</option>
          <option value="putt">Putt</option>
        </select>

        {shotType !== 'putt' && (
          <>
            <input
              type="text"
              placeholder="Club Used"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="input input-bordered"
            />

            {shotType !== 'tee' && (
              <input
                type="number"
                placeholder="Distance to Target (yards)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="input input-bordered"
              />
            )}

            <select
              value={result}
              onChange={(e) => {
                setResult(e.target.value as ShotResult)
                setShowPenalty(e.target.value === 'hazard')
              }}
              className="select select-bordered"
            >
              <option value="fairway">Fairway</option>
              <option value="rough">Rough</option>
              <option value="bunker">Bunker</option>
              <option value="hazard">Hazard</option>
              <option value="green">Green</option>
            </select>

            {result !== 'fairway' && result !== 'green' && (
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="select select-bordered"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            )}

            {showPenalty && (
              <select
                value={penaltyType}
                onChange={(e) => setPenaltyType(e.target.value as HazardType)}
                className="select select-bordered"
              >
                <option value="water">Water Hazard</option>
                <option value="ob">Out of Bounds</option>
                <option value="unplayable">Unplayable Lie</option>
              </select>
            )}
          </>
        )}

        {shotType === 'putt' && (
          <input
            type="number"
            placeholder="Distance to Hole (feet)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="input input-bordered"
          />
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Add Shot
      </button>
    </form>
  )
} 