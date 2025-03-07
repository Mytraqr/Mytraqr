import { Round, Shot } from '@/types'

export interface StatsData {
  roundsPlayed: number
  scoringAverage: number
  fairwayPercentage: number
  greenInRegulationPercentage: number
  averagePutts: number
  upAndDownPercentage: number
  penaltiesPerRound: number
  approachStats: {
    [key: string]: {
      total: number
      greens: number
      percentage: number
    }
  }
  puttingStats: {
    [key: string]: {
      total: number
      made: number
      percentage: number
    }
  }
}

export function calculateStats(rounds: Round[]): StatsData {
  const stats: StatsData = {
    roundsPlayed: rounds.length,
    scoringAverage: 0,
    fairwayPercentage: 0,
    greenInRegulationPercentage: 0,
    averagePutts: 0,
    upAndDownPercentage: 0,
    penaltiesPerRound: 0,
    approachStats: {
      '50-100': { total: 0, greens: 0, percentage: 0 },
      '100-150': { total: 0, greens: 0, percentage: 0 },
      '150-200': { total: 0, greens: 0, percentage: 0 },
      '200+': { total: 0, greens: 0, percentage: 0 }
    },
    puttingStats: {
      '<5': { total: 0, made: 0, percentage: 0 },
      '5-10': { total: 0, made: 0, percentage: 0 },
      '10-20': { total: 0, made: 0, percentage: 0 },
      '20+': { total: 0, made: 0, percentage: 0 }
    }
  }

  let totalScore = 0
  let totalFairways = 0
  let totalGreens = 0
  let totalPutts = 0
  let upAndDownAttempts = 0
  let upAndDownSuccesses = 0
  let totalPenalties = 0

  rounds.forEach(round => {
    let roundScore = 0
    let roundPutts = 0

    round.holes.forEach(hole => {
      // Count shots and penalties
      const score = hole.shots.length + 
        hole.shots.reduce((acc, shot) => acc + (shot.penalty?.strokes || 0), 0)
      roundScore += score

      // Count fairways (only for par 4s and 5s)
      if (hole.par >= 4) {
        const teeShot = hole.shots.find(s => s.type === 'tee')
        if (teeShot?.result === 'fairway') {
          totalFairways++
        }
      }

      // Count greens in regulation
      const shotsToGreen = hole.shots.findIndex(s => s.result === 'green')
      if (shotsToGreen <= hole.par - 2) {
        totalGreens++
      }

      // Count putts and up-and-downs
      const putts = hole.shots.filter(s => s.type === 'putt')
      roundPutts += putts.length

      // Track approach shot distances
      hole.shots.forEach(shot => {
        if (shot.type === 'approach' && shot.distance) {
          const distanceKey = getDistanceKey(shot.distance)
          if (distanceKey) {
            stats.approachStats[distanceKey].total++
            if (shot.result === 'green') {
              stats.approachStats[distanceKey].greens++
            }
          }
        }

        // Track penalties
        if (shot.penalty) {
          totalPenalties += shot.penalty.strokes
        }
      })

      // Track putting distances
      putts.forEach((putt, index) => {
        if (putt.distance) {
          const distanceKey = getPuttDistanceKey(putt.distance)
          if (distanceKey) {
            stats.puttingStats[distanceKey].total++
            if (index === putts.length - 1) { // If it's the last putt, it went in
              stats.puttingStats[distanceKey].made++
            }
          }
        }
      })
    })

    totalScore += roundScore
    totalPutts += roundPutts
  })

  // Calculate final stats
  stats.scoringAverage = totalScore / rounds.length
  stats.fairwayPercentage = (totalFairways / (rounds.length * 14)) * 100 // Assuming 14 driving holes per round
  stats.greenInRegulationPercentage = (totalGreens / (rounds.length * 18)) * 100
  stats.averagePutts = totalPutts / rounds.length
  stats.upAndDownPercentage = upAndDownAttempts ? (upAndDownSuccesses / upAndDownAttempts) * 100 : 0
  stats.penaltiesPerRound = totalPenalties / rounds.length

  // Calculate percentages for approach and putting stats
  Object.keys(stats.approachStats).forEach(key => {
    const { total, greens } = stats.approachStats[key]
    stats.approachStats[key].percentage = total ? (greens / total) * 100 : 0
  })

  Object.keys(stats.puttingStats).forEach(key => {
    const { total, made } = stats.puttingStats[key]
    stats.puttingStats[key].percentage = total ? (made / total) * 100 : 0
  })

  return stats
}

function getDistanceKey(distance: number): string | null {
  if (distance < 100) return '50-100'
  if (distance < 150) return '100-150'
  if (distance < 200) return '150-200'
  return '200+'
}

function getPuttDistanceKey(distance: number): string | null {
  if (distance < 5) return '<5'
  if (distance < 10) return '5-10'
  if (distance < 20) return '10-20'
  return '20+'
} 