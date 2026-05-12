import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
import {
  m2m,
  simpleCalories,
  pandolfCalories,
} from '../src/index.js'
import { calculateSlopeGrade } from '../src/slope.js'
import walk_1 from './walk_1.json' with { type: 'json' }
import walk_2 from './walk_2.json' with { type: 'json' }
import walk_3 from './walk_3.json' with { type: 'json' }
import walk_4 from './walk_4.json' with { type: 'json' }

console.log(walk_1.features[0].geometry.coordinates[0])
console.log(walk_2.features[0].geometry.coordinates[0])
console.log(walk_3.features[0].geometry.coordinates[0])
console.log(walk_4.features[0].geometry.coordinates[0])

const skip = { skip: true }
const weights = {
  body: 160 / 2.2, 
  ruck: 0,
  water: 0,
}

const gpsPointA = {
  latitude: 34.0522,
  longitude: -118.2437,
  altitude: 100,
}

const gpsPointB = {
  latitude: 34.0530,
  longitude: -118.2420,
  altitude: 150,
}

const slope = calculateSlopeGrade(gpsPointA, gpsPointB)
console.log(`Slope Percentage: ${slope.percentage.toFixed(2)}%`)
console.log(`Slope Angle: ${slope.angleDegrees.toFixed(2)} degrees`)

describe('First test suite for calories package', async () => {
  before(() => {
    console.log('running before each test')
  })
  after(() => {
    console.log('running after each test')
  })

  it('First calorie test - simpleCalories', async () => {
    // const walk_1_minutes = walk_1.features[0].properties.duration / 60000
    const walk_1_minutes = m2m(walk_1.features[0].properties.duration)
    const finish = m2m(walk_1.features[0].properties.endTime)
    const start  = m2m(walk_1.features[0].properties.startTime)
    // const walk_1_timediff = (finish - start) / 60000
    const walk_1_timediff = finish - start
    console.log('duration:', walk_1_minutes)
    console.log('difftime:', walk_1_timediff)
    const cals_1 = simpleCalories(walk_1_minutes, weights)
    console.log(cals_1)
    const cals_2 = simpleCalories(walk_1_timediff, weights)
    console.log(cals_2)

    assert(!isNaN(cals_1) && cals_1 > 0)
    assert(!isNaN(cals_2) && cals_2 > 0)
  })

  it('Second calorie test - advancedCalories', async () => {
    const calClamp = 1.5
    const cal1RawDuration = walk_1.features[0].properties.duration
    const cal2RawDuration = walk_2.features[0].properties.duration
    const cal3RawDuration = walk_3.features[0].properties.duration

    const cal1W = walk_1.features[0].properties.weights
    const cal1 = pandolfCalories(
      walk_1.features[0].geometry.coordinates,
      { weightKg: cal1W.body, loadKg: cal1W.ruck, waterKg: cal1W.water, terrain: 1.1 },
    )
    console.log(`walk_1 pandolf calories: ${cal1.totalKcal}`)
    console.log(`walk_1 pandolf distance: ${cal1.totalDistanceM}, ${walk_1.features[0].properties.distance}`)
    console.log(`walk_1 pandolf duration: ${cal1.totalDurationSec}, ${walk_1.features[0].properties.duration}`)
    cal1.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(`seg # ${i}, seg kcal ${seg.kcal}, distance ${seg.horizontalDistance}, time ${seg.durationSec}`)
      }
    })
    const cal2W = walk_2.features[0].properties.weights
    const cal2 = pandolfCalories(
      walk_2.features[0].geometry.coordinates,
      { weightKg: cal2W.body, loadKg: cal2W.ruck, waterKg: cal2W.water, terrain: 1.1 },
    )
    // console.log('walk_2 pandolf calories', cal2.totalKcal, cal2.totalDistanceM, cal2.totalDurationSec)
    console.log(`walk_2 pandolf calories: ${cal2.totalKcal}`)
    console.log(`walk_2 pandolf distance: ${cal2.totalDistanceM}, ${walk_2.features[0].properties.distance}`)
    console.log(`walk_2 pandolf duration: ${cal2.totalDurationSec}, ${walk_2.features[0].properties.duration}`)
    cal2.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(`seg # ${i}, seg kcal ${seg.kcal}, distance ${seg.horizontalDistance}, time ${seg.durationSec}`)
      }
    })
    const cal3W = walk_3.features[0].properties.weights
    const cal3 = pandolfCalories(
      walk_3.features[0].geometry.coordinates,
      { weightKg: cal3W.body, loadKg: cal3W.ruck, waterKg: cal3W.water, terrain: 1.1 },
    )
    // console.log('walk_3 pandolf calories', cal3.totalKcal, cal3.totalDistanceM, cal3.totalDurationSec)
    console.log(`walk_3 pandolf calories: ${cal3.totalKcal}`)
    console.log(`walk_3 pandolf distance: ${cal3.totalDistanceM}, ${walk_3.features[0].properties.distance}`)
    console.log(`walk_3 pandolf duration: ${cal3.totalDurationSec}, ${walk_3.features[0].properties.duration}`)
    cal3.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(`seg # ${i}, seg kcal ${seg.kcal}, distance ${seg.horizontalDistance}, time ${seg.durationSec}`)
      }
    })
    const cal4W = walk_3.features[0].properties.weights
    const cal4 = pandolfCalories(
      walk_4.features[0].geometry.coordinates,
      { weightKg: cal4W.body, loadKg: cal4W.ruck, waterKg: cal4W.water, terrain: 1.1 },
    )
    // console.log('walk_4 pandolf calories', cal4.totalKcal, cal4.totalDistanceM, cal4.totalDurationSec)
    console.log(`walk_4 pandolf calories: ${cal4.totalKcal}`)
    console.log(`walk_4 pandolf distance: ${cal4.totalDistanceM}, ${walk_4.features[0].properties.distance}`)
    console.log(`walk_4 pandolf duration: ${cal4.totalDurationSec}, ${walk_4.features[0].properties.duration}`)
    cal4.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(`seg # ${i}, seg kcal ${seg.kcal}, distance ${seg.horizontalDistance}, time ${seg.durationSec}`)
      }
    })

  })
})
