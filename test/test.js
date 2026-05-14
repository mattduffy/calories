import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
import {
  m2m,
  within5,
  within10,
  simpleCalories,
  pandolfCalories,
} from '../src/index.js'
import { calculateSlopeGrade } from '../src/slope.js'
import walk_1 from './walk_1.json' with { type: 'json' }
import walk_2 from './walk_2.json' with { type: 'json' }
import walk_3 from './walk_3.json' with { type: 'json' }
import walk_4 from './walk_4.json' with { type: 'json' }
import walk_5 from './walk_5.json' with { type: 'json' }

// console.log(walk_1.features[0].geometry.coordinates[0])
// console.log(walk_2.features[0].geometry.coordinates[0])
// console.log(walk_3.features[0].geometry.coordinates[0])
// console.log(walk_4.features[0].geometry.coordinates[0])

const skip = { skip: true }
const weights = {
  body: (160 / 2.2), 
  ruck: (30 / 2.2),
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
    console.log('running before the tests')
  })
  after(() => {
    console.log('running after after the test')
  })

  it('First calorie test - simpleCalories', async () => {
    const walk_1_minutes = m2m(walk_1.features[0].properties.duration)
    const walk_1_timediff = m2m(walk_1.features[0].properties.endTime)
      - m2m(walk_1.features[0].properties.startTime)
    console.log('name:', walk_1.features[0].properties.name)
    console.log('duration:', walk_1_minutes)
    console.log('difftime:', walk_1_timediff)
    const cals_1 = simpleCalories(walk_1_minutes, weights)
    console.log('just calculated:', cals_1)
    console.log('original value:', walk_1.features[0].properties.simpleCalories)

    const walk_2_minutes = m2m(walk_2.features[0].properties.duration)
    const walk_2_timediff = m2m(walk_2.features[0].properties.endTime)
      - m2m(walk_2.features[0].properties.startTime)
    console.log('name:', walk_2.features[0].properties.name)
    console.log('duration:', walk_2_minutes)
    console.log('difftime:', walk_2_timediff)
    const cals_2 = simpleCalories(walk_2_timediff, weights)
    console.log('just calculated:', cals_2)
    console.log('original value:', walk_2.features[0].properties.simpleCalories)

    console.log('')
    console.log('')

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
    let simple = walk_1.features[0].properties.simpleCalories
    console.log(`name: ${walk_1.features[0].properties.name}`)
    console.log(`walk_1 pandolf calories: ${cal1.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(cal1.totalDistanceM, walk_1.features[0].properties.distance))
    console.log('within10: ', within10(cal1.totalDistanceM, walk_1.features[0].properties.distance))
    console.log(
      `walk_1 pandolf distance: ${cal1.totalDistanceM} (${walk_1.features[0].properties.distance})`
    )
    console.log(
      `walk_1 pandolf duration: ${cal1.totalDurationSec}, `
      + `(${walk_1.features[0].properties.duration / 1000})`
    )
    cal1.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`)
      }
    })

    console.log('')
    const cal2W = walk_2.features[0].properties.weights
    const cal2 = pandolfCalories(
      walk_2.features[0].geometry.coordinates,
      { weightKg: cal2W.body, loadKg: cal2W.ruck, waterKg: cal2W.water, terrain: 1.1 },
    )
    simple = walk_2.features[0].properties.simpleCalories
    console.log(`name: ${walk_2.features[0].properties.name}`)
    console.log(`walk_2 pandolf calories: ${cal2.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(cal2.totalDistanceM, walk_2.features[0].properties.distance))
    console.log('within10: ', within10(cal2.totalDistanceM, walk_2.features[0].properties.distance))
    console.log(
      `walk_2 pandolf distance: ${cal2.totalDistanceM} (${walk_2.features[0].properties.distance})`
    )
    console.log(
      `walk_2 pandolf duration: ${cal2.totalDurationSec}, `
      + `(${walk_2.features[0].properties.duration / 1000})`
    )
    cal2.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`)
      }
    })

    console.log('')
    const cal3W = walk_3.features[0].properties.weights
    const cal3 = pandolfCalories(
      walk_3.features[0].geometry.coordinates,
      { weightKg: cal3W.body, loadKg: cal3W.ruck, waterKg: cal3W.water, terrain: 1.1 },
    )
    simple = walk_3.features[0].properties.simpleCalories
    console.log(`name: ${walk_3.features[0].properties.name}`)
    console.log(`walk_3 pandolf calories: ${cal3.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(cal3.totalDistanceM, walk_3.features[0].properties.distance))
    console.log('within10: ', within10(cal3.totalDistanceM, walk_3.features[0].properties.distance))
    console.log(
      `walk_3 pandolf distance: ${cal3.totalDistanceM} (${walk_3.features[0].properties.distance})`
    )
    console.log(
      `walk_3 pandolf duration: ${cal3.totalDurationSec}, `
      + `(${walk_3.features[0].properties.duration / 1000})`
    )
    cal3.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`
        )
      }
    })

    console.log('')
    const cal4W = walk_4.features[0].properties.weights ?? weights 
    const cal4 = pandolfCalories(
      walk_4.features[0].geometry.coordinates,
      {
        weightKg: (cal4W.body / 2.2),
        loadKg: (cal4W.ruck / 2.2),
        waterKg: (cal4W.water / 2.2),
        terrain: 1.1,
      },
    )
    simple = walk_4.features[0].properties.simpleCalories
    console.log(`name: ${walk_4.features[0].properties.name}`)
    console.log(`walk_4 pandolf calories: ${cal4.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(cal4.totalDistanceM, walk_4.features[0].properties.distance))
    console.log('within10: ', within10(cal4.totalDistanceM, walk_4.features[0].properties.distance))
    console.log(
      `walk_4 pandolf distance: ${cal4.totalDistanceM} (${walk_4.features[0].properties.distance})`
    )
    console.log(
      `walk_4 pandolf duration: ${cal4.totalDurationSec}, `
      + `(${walk_4.features[0].properties.duration / 1000})`
    )
    cal4.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`
        )
      }
    })

    console.log('')
    const cal5W = walk_4.features[0].properties.weights ?? weights 
    const walk5Simple = simpleCalories(
      m2m(walk_5.features[0].properties.duration),
      weights
    )
    const cal5 = pandolfCalories(
      walk_5.features[0].geometry.coordinates,
      {
        weightKg: (cal5W.body / 2.2),
        loadKg: (cal5W.ruck / 2.2),
        waterKg: (cal5W.water / 2.2),
        terrain: 1.1,
      },
    )
    simple = walk_5.features[0].properties.simpleCalories
    console.log(`name: ${walk_5.features[0].properties.name}`)
    console.log(`walk_5 pandolf calories: ${cal5.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_5 pandolf distance: ${cal5.totalDistanceM} (${walk_5.features[0].properties.distance})`
    )
    console.log(
      `walk_5 pandolf duration: ${cal5.totalDurationSec}, `
      + `(${walk_5.features[0].properties.duration / 1000})`
    )
    console.log('within5 distance:', within5(cal5.totalDistanceM, walk_5.features[0].properties.distance))
    console.log('within10 distance:', within10(cal5.totalDistanceM, walk_5.features[0].properties.distance))
    console.log('within5 calories:', within5(cal5.totalKcal, walk5Simple))
    console.log('within10 calories:', within10(cal5.totalKcal, walk5Simple))
    cal5.segments.map((seg, i) => {
      if (seg.kcal > calClamp) { 
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`
        )
      }
    })
    
  })

  it(
    'Fix issue with pandolf function time calculations in seconds rather than milliseconds.',
    async () => {
    console.log('pandolf function is using seconds instead of milliseconds.')
    // assert(false)
  })
})
