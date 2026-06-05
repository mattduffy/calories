/* eslint-disable camelcase */
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
  calculateSlopeGrade,
} from '../src/index.js'
import walk_1 from './walk_01-back-in-the-game.json' with { type: 'json' }
import walk_2 from './walk_02-4-genies-and-a-pea.json' with { type: 'json' }
import walk_3 from './walk_03-read-the-spells.json' with { type: 'json' }
import walk_4 from './walk_04-calories-test.json' with { type: 'json' }
import walk_5 from './walk_05-sewer-monster.json' with { type: 'json' }
import walk_6 from './walk_06-meat-stew.json' with { type: 'json' }
import walk_7 from './walk_07-meat-stu.json' with { type: 'json' }
import walk_8 from './walk_08-sf-stumbes.json' with { type: 'json' }
import walk_9 from './walk_09-50-gredits-per-throw.json' with { type: 'json' }
import walk_10 from './walk_10-bamf-gravity-drive.json' with { type: 'json' }

// console.log(walk_1.features[0].geometry.coordinates[0])
// console.log(walk_2.features[0].geometry.coordinates[0])
// console.log(walk_3.features[0].geometry.coordinates[0])
// console.log(walk_4.features[0].geometry.coordinates[0])

const results = [
  {
    date: null,
    name: null,
    distance: null,
    duration: null,
    weights: null,
    simple1: null,
    simple2: null,
    pandolf1: null,
    pandolf2: null,
    minimumMech: null,
    apple: null,
  },
]

// const skip = { skip: true }
const weights = {
  body: 70, // (160 / 2.2),
  ruck: 5, // (30 / 2.2),
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

const calClamp = 1.5
const slope = calculateSlopeGrade(gpsPointA, gpsPointB)
console.log(`Slope Percentage: ${slope.grade.toFixed(2)}%`)
console.log(`Slope Angle: ${slope.angleDegrees.toFixed(2)} degrees`)

function dist(m) {
  if (m < 1) {
    return '0 km (0 miles)'
  }
  return `${(m / 1000).toFixed(2)} km (${((m / 1000) * 0.6).toFixed(2)} miles)`
}

function _dot1(f) {
  if (!f) {
    return null
  }
  return Number.parseFloat(f.toFixed(1))
}

describe('First test suite for calories package', async () => {
  before(() => {
    console.log('running before the tests')
  })
  after(() => {
    console.log('running after after the test')
  })

  it('Missing required parameters: minutes - simpleCalories', async () => {
    const badMinutes = 'bad'
    assert.throws(() => { simpleCalories(badMinutes, weights) })
    const zeroMinutes = 0
    assert.throws(() => { simpleCalories(zeroMinutes, weights) })
    const nullMinutes = null
    assert.throws(() => { simpleCalories(nullMinutes, weights) })
  })
  it('Missing required parameter: weights.body - simplCalories', async () => {
    const nullBodyWeight = { body: null }
    assert.throws(() => { simpleCalories(10, nullBodyWeight) })
    const zeroBodyWeight = { body: 0 }
    assert.throws(() => { simpleCalories(10, zeroBodyWeight) })
    const undefinedBodyWeight = { }
    assert.throws(() => { simpleCalories(10, undefinedBodyWeight) })
  })
  it('Missing required parameter: MET - simplCalories', async () => {
    const nullMET = null
    assert.throws(() => { simpleCalories(10, { body: 70 }, nullMET) })
    const zeroMET = 0
    assert.throws(() => { simpleCalories(10, { body: 70 }, zeroMET) })
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
    const date_1 = new Date(walk_1.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_1,
      name: walk_1.features[0].properties.name,
      distance: dist(walk_1.features[0].properties.distance),
      duration: _dot1(walk_1_minutes),
      weights: `b: ${_dot1(weights.body)}, r: ${_dot1(weights.ruck)}`,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(cals_1),
      pandolf1: _dot1(walk_1.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: null,
      minimumMech: null,
      apple: null,
    })
    const walk_2_minutes = m2m(walk_2.features[0].properties.duration)
    const walk_2_timediff = m2m(walk_2.features[0].properties.endTime)
      - m2m(walk_2.features[0].properties.startTime)
    console.log('name:', walk_2.features[0].properties.name)
    console.log('duration:', walk_2_minutes)
    console.log('difftime:', walk_2_timediff)
    const cals_2 = simpleCalories(walk_2_timediff, weights)
    console.log('just calculated:', cals_2)
    console.log('original value:', walk_2.features[0].properties.simpleCalories)
    console.log('\n\n')
    const date_2 = new Date(walk_2.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_2,
      name: walk_2.features[0].properties.name,
      distance: dist(walk_2.features[0].properties.distance),
      duration: _dot1(walk_2_minutes),
      weights: `b: ${_dot1(weights.body)}, r: ${_dot1(weights.ruck)}`,
      simple1: _dot1(walk_2.features[0].properties.simpleCalories),
      simple2: _dot1(cals_2),
      pandolf1: _dot1(walk_2.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: null,
      minimumMech: null,
      apple: null,
    })
    assert(!Number.isNaN(cals_1) && cals_1 > 0)
    assert(!Number.isNaN(cals_2) && cals_2 > 0)
  })

  it('Test missing coordinates array parameter - pandolfCalories', async () => {
    const coords = [[]]
    const options = { bodyWeightKg: 70 }
    // pandolfCalories(coords, options)
    assert.throws(() => { pandolfCalories(coords, options) })
  })
  it('Test missing options object parameter - pandolfCalories', async () => {
    const coords = walk_5.features[0].geometry.coordinates
    const options = { }
    // pandolfCalories(coords, options)
    assert.throws(() => { pandolfCalories(coords, options) })
  })
  it('Second calorie test - advancedCalories', async () => {
    // const cal1RawDuration = walk_1.features[0].properties.duration
    // const cal2RawDuration = walk_2.features[0].properties.duration
    // const cal3RawDuration = walk_3.features[0].properties.duration

    const cal1W = walk_1.features[0].properties.weights ?? weights
    const cal1 = pandolfCalories(
      walk_1.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal1W.body, loadKg: cal1W.ruck, waterKg: cal1W.water, terrain: 1.1,
      },
    )
    results[1].pandolf2 = _dot1(cal1.totalKcal)
    const simple = walk_1.features[0].properties.simpleCalories
    console.log(`name: ${walk_1.features[0].properties.name}`)
    console.log(`walk_1 pandolf calories: ${cal1.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(
      cal1.totalDistanceM,
      walk_1.features[0].properties.distance,
    ))
    console.log('within10: ', within10(
      cal1.totalDistanceM,
      walk_1.features[0].properties.distance,
    ))
    console.log(
      `walk_1 pandolf distance: ${cal1.totalDistanceM} `
      + `(${walk_1.features[0].properties.distance})`,
    )
    console.log(
      `walk_1 pandolf duration: ${cal1.totalDurationSec}, `
      + `(${walk_1.features[0].properties.duration / 1000})`,
    )
    cal1.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_02', async () => {
    console.log('')
    const cal2W = walk_2.features[0].properties.weights
    const cal2 = pandolfCalories(
      walk_2.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal2W.body, loadKg: cal2W.ruck, waterKg: cal2W.water, terrain: 1.1,
      },
    )
    results[2].pandolf2 = _dot1(cal2.totalKcal)
    const simple = walk_2.features[0].properties.simpleCalories
    console.log(`name: ${walk_2.features[0].properties.name}`)
    console.log(`walk_2 pandolf calories: ${cal2.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5: ', within5(
      cal2.totalDistanceM,
      walk_2.features[0].properties.distance,
    ))
    console.log('within10: ', within10(
      cal2.totalDistanceM,
      walk_2.features[0].properties.distance,
    ))
    console.log(
      `walk_2 pandolf distance: ${cal2.totalDistanceM} `
      + `(${walk_2.features[0].properties.distance})`,
    )
    console.log(
      `walk_2 pandolf duration: ${cal2.totalDurationSec}, `
      + `(${walk_2.features[0].properties.duration / 1000})`,
    )
    cal2.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_03', async () => {
    console.log('')
    const cal3W = walk_3.features[0].properties.weights
    const walk_3_minutes = m2m(walk_3.features[0].properties.duration)
    const cals_3 = simpleCalories(walk_3_minutes, cal3W)
    const cal3 = pandolfCalories(
      walk_3.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal3W.body, loadKg: cal3W.ruck, waterKg: cal3W.water, terrain: 1.1,
      },
    )
    const simple = walk_3.features[0].properties.simpleCalories
    const date_3 = new Date(walk_3.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_3,
      name: walk_3.features[0].properties.name,
      distance: dist(walk_3.features[0].properties.distance),
      duration: _dot1(m2m(walk_3.features[0].properties.duration)),
      weights: `b: ${_dot1(cal3W.body / 2.2)}, r: ${_dot1(cal3W.ruck / 2.2)}`,
      simple1: _dot1(cals_3),
      simple2: _dot1(walk_3.features[0].properties.simpleCalories),
      pandolf1: _dot1(walk_3.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal3.totalKcal),
      minimumMech: null,
      apple: null,
    })
    console.log(`name: ${walk_3.features[0].properties.name}`)
    console.log(`walk_3 pandolf calories: ${cal3.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5 total distance: ', within5(
      cal3.totalDistanceM,
      walk_3.features[0].properties.distance,
    ))
    console.log('within10 total distance: ', within10(
      cal3.totalDistanceM,
      walk_3.features[0].properties.distance,
    ))
    console.log(
      `walk_3 pandolf distance: ${cal3.totalDistanceM} `
      + `(${walk_3.features[0].properties.distance})`,
    )
    console.log(
      `walk_3 pandolf duration: ${cal3.totalDurationSec}, `
      + `(${walk_3.features[0].properties.duration / 1000})`,
    )
    cal3.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_04', async () => {
    console.log('')
    const cal4W = walk_4.features[0].properties.weights ?? weights
    const cal4 = pandolfCalories(
      walk_4.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal4W.body / 2.2),
        loadKg: (cal4W.ruck / 2.2),
        waterKg: (cal4W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_4.features[0].properties.simpleCalories
    console.log(`name: ${walk_4.features[0].properties.name}`)
    console.log(`walk_4 pandolf calories: ${cal4.totalKcal} (simpleCalories: ${simple})`)
    console.log('within5 total distance: ', within5(
      cal4.totalDistanceM,
      walk_4.features[0].properties.distance,
    ))
    console.log('within10 total distance: ', within10(
      cal4.totalDistanceM,
      walk_4.features[0].properties.distance,
    ))
    console.log(
      `walk_4 pandolf distance: ${cal4.totalDistanceM} `
      + `(${walk_4.features[0].properties.distance})`,
    )
    console.log(
      `walk_4 pandolf duration: ${cal4.totalDurationSec}, `
      + `(${walk_4.features[0].properties.duration / 1000})`,
    )
    cal4.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
    const walk_4_minutes = m2m(walk_4.features[0].properties.duration)
    const weights_4 = walk_4.features[0].properties.weights ?? weights
    weights_4.ruck = 30
    console.log('walk_4 weights:', weights_4)
    const cals_4 = simpleCalories(walk_4_minutes, weights_4)
    const date_4 = new Date(walk_4.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_4,
      name: walk_4.features[0].properties.name,
      distance: dist(walk_4.features[0].properties.distance),
      duration: _dot1(walk_4_minutes),
      weights: `b: ${_dot1(cal4W.body / 2.2)}, r: ${_dot1(cal4W.ruck / 2.2)}`,
      simple1: _dot1(simple),
      simple2: _dot1(cals_4),
      pandolf1: _dot1(walk_4.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal4.totalKcal),
      minimumMech: null,
      apple: null,
    })
  })

  it('Advanced calorie comparison test - walk_05', async () => {
    console.log('')
    const cal5W = walk_5.features[0].properties.weights ?? weights
    const walk5Simple = simpleCalories(
      m2m(walk_5.features[0].properties.duration),
      weights,
    )
    const cal5 = pandolfCalories(
      walk_5.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal5W.body / 2.2),
        loadKg: (cal5W.ruck / 2.2),
        waterKg: (cal5W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_5.features[0].properties.simpleCalories
    const walk_5_minutes = m2m(walk_5.features[0].properties.duration)
    const date_5 = new Date(walk_5.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_5,
      name: walk_5.features[0].properties.name,
      distance: dist(walk_5.features[0].properties.distance),
      duration: _dot1(walk_5_minutes),
      weights: `b: ${cal5W.body / 2.2}, r: ${_dot1(cal5W.ruck / 2.2)}`,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk5Simple),
      pandolf1: _dot1(walk_5.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal5.totalKcal),
      minimumMech: null,
      apple: null,
    })
    console.log(`name: ${walk_5.features[0].properties.name}`)
    console.log(`walk_5 pandolf calories: ${cal5.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_5 pandolf distance: ${cal5.totalDistanceM} `
      + `(${walk_5.features[0].properties.distance})`,
    )
    console.log(
      `walk_5 pandolf duration: ${cal5.totalDurationSec}, `
      + `(${walk_5.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      within5(cal5.totalDistanceM, walk_5.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal5.totalDistanceM, walk_5.features[0].properties.distance),
    )
    console.log('within5 calories:', within5(cal5.totalKcal, walk5Simple))
    console.log('within10 calories:', within10(cal5.totalKcal, walk5Simple))
    cal5.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_06', async () => {
    console.log('')
    const cal6W = walk_6.features[0].properties.weights ?? weights
    const walk6Simple = simpleCalories(
      m2m(walk_6.features[0].properties.duration),
      weights,
    )
    const cal6 = pandolfCalories(
      walk_6.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal6W.body / 2.2),
        loadKg: (cal6W.ruck / 2.2),
        waterKg: (cal6W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_6.features[0].properties.simpleCalories
    const walk_6_minutes = m2m(walk_6.features[0].properties.duration)
    const date_6 = new Date(walk_6.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_6,
      name: walk_6.features[0].properties.name,
      distance: dist(walk_6.features[0].properties.distance),
      duration: _dot1(walk_6_minutes),
      weights: `b: ${_dot1(cal6W.body / 2.2)}, r: ${_dot1(cal6W.ruck / 2.2)}`,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk6Simple),
      pandolf1: _dot1(walk_6.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal6.totalKcal),
      minimumMech: null,
      apple: null,
    })
    console.log(`name: ${walk_6.features[0].properties.name}`)
    console.log(`walk_6 pandolf calories: ${cal6.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_6 pandolf distance: ${cal6.totalDistanceM} `
      + `(${walk_6.features[0].properties.distance})`,
    )
    console.log(
      `walk_6 pandolf duration: ${cal6.totalDurationSec}, `
      + `(${walk_6.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      within5(cal6.totalDistanceM, walk_6.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal6.totalDistanceM, walk_6.features[0].properties.distance),
    )
    console.log('within5 calories:', within5(cal6.totalKcal, walk6Simple))
    console.log('within10 calories:', within10(cal6.totalKcal, walk6Simple))
    cal6.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_07', async () => {
    console.log('')
    const cal7W = walk_7.features[0].properties.weights ?? weights
    const walk7Simple = simpleCalories(
      m2m(walk_7.features[0].properties.duration),
      weights,
    )
    const cal7 = pandolfCalories(
      walk_7.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal7W.body / 2.2),
        loadKg: (cal7W.ruck / 2.2),
        waterKg: (cal7W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_7.features[0].properties.simpleCalories
    const walk_7_minutes = m2m(walk_7.features[0].properties.duration)
    const date_7 = new Date(walk_7.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_7,
      name: walk_7.features[0].properties.name,
      distance: dist(walk_7.features[0].properties.distance),
      duration: _dot1(walk_7_minutes),
      weights: `b: ${_dot1(cal7W.body / 2.2)}, r: ${_dot1(cal7W.ruck / 2.2)}`,
      simple1: _dot1(walk_7.features[0].properties.simpleCalories),
      simple2: _dot1(walk7Simple),
      pandolf1: _dot1(walk_7.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal7.totalKcal),
      minimumMech: null,
      apple: null,
    })
    console.log(`name: ${walk_7.features[0].properties.name}`)
    console.log(`walk_7 pandolf calories: ${cal7.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_7 pandolf distance: ${cal7.totalDistanceM} `
      + `(${walk_7.features[0].properties.distance})`,
    )
    console.log(
      `walk_7 pandolf duration: ${cal7.totalDurationSec}, `
      + `(${walk_7.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      within5(cal7.totalDistanceM, walk_7.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal7.totalDistanceM, walk_7.features[0].properties.distance),
    )
    console.log('within5 calories:', within5(cal7.totalKcal, walk7Simple))
    console.log('within10 calories:', within10(cal7.totalKcal, walk7Simple))
    cal7.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_08', async () => {
    console.log('')
    const cal8W = walk_8.features[0].properties.weights ?? weights
    const walk8Simple = simpleCalories(
      m2m(walk_8.features[0].properties.duration),
      weights,
    )
    const cal8 = pandolfCalories(
      walk_8.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal8W.body / 2.2),
        loadKg: (cal8W.ruck / 2.2),
        waterKg: (cal8W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_8.features[0].properties.simpleCalories
    const walk_8_minutes = m2m(walk_8.features[0].properties.duration)
    const date_8 = new Date(walk_8.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_8,
      name: walk_8.features[0].properties.name,
      distance: dist(walk_8.features[0].properties.distance),
      duration: _dot1(walk_8_minutes),
      weights: `b: ${_dot1(cal8W.body / 2.2)}, r: ${cal8W.ruck / 2.2}`,
      simple1: _dot1(walk_8.features[0].properties.simpleCalories),
      simple2: _dot1(walk8Simple),
      pandolf1: _dot1(walk_8.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal8.totalKcal),
      minimumMech: null,
      apple: null,
    })
    console.log(`name: ${walk_8.features[0].properties.name}`)
    console.log(`walk_8 pandolf calories: ${cal8.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_8 pandolf distance: ${cal8.totalDistanceM} `
      + `(${walk_8.features[0].properties.distance})`,
    )
    console.log(
      `walk_8 pandolf duration: ${cal8.totalDurationSec}, `
      + `(${walk_8.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      within5(cal8.totalDistanceM, walk_8.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal8.totalDistanceM, walk_8.features[0].properties.distance),
    )
    console.log('within5 calories:', within5(cal8.totalKcal, walk8Simple))
    console.log('within10 calories:', within10(cal8.totalKcal, walk8Simple))
    cal8.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_09', async () => {
    console.log('')
    const cal9W = walk_9.features[0].properties.weights ?? weights
    const walk9Simple = simpleCalories(
      m2m(walk_9.features[0].properties.duration),
      weights,
    )
    const cal9 = pandolfCalories(
      walk_9.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal9W.body / 2.2),
        loadKg: (cal9W.ruck / 2.2),
        waterKg: (cal9W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_9.features[0].properties.simpleCalories
    const walk_9_minutes = m2m(walk_9.features[0].properties.duration)
    const date_9 = new Date(walk_9.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_9,
      name: walk_9.features[0].properties.name,
      distance: dist(walk_9.features[0].properties.distance),
      duration: _dot1(walk_9_minutes),
      weights: `b: ${_dot1(cal9W.body / 2.2)}, r: ${_dot1(cal9W.ruck / 2.2)}`,
      simple1: _dot1(walk_9.features[0].properties.simpleCalories),
      simple2: _dot1(walk9Simple),
      pandolf1: _dot1(walk_9.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal9.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_9.features[0].properties.apple.activity),
    })
    console.log(`name: ${walk_9.features[0].properties.name}`)
    console.log(`walk_9 pandolf calories: ${cal9.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_9 pandolf distance: ${cal9.totalDistanceM} `
      + `(${walk_9.features[0].properties.distance})`,
    )
    console.log(
      `walk_9 pandolf duration: ${cal9.totalDurationSec}, `
      + `(${walk_9.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      within5(cal9.totalDistanceM, walk_9.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal9.totalDistanceM, walk_9.features[0].properties.distance),
    )
    console.log('within5 calories:', within5(cal9.totalKcal, walk9Simple))
    console.log('within10 calories:', within10(cal9.totalKcal, walk9Simple))
    cal9.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Advanced calorie comparison test - walk_10', async () => {
    console.log('')
    const cal10W = walk_10.features[0].properties.weights ?? weights
    const walk10Simple = simpleCalories(
      m2m(walk_10.features[0].properties.duration),
      weights,
    )
    const cal10 = pandolfCalories(
      walk_10.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal10W.body / 2.2),
        loadKg: (cal10W.ruck / 2.2),
        waterKg: (cal10W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_10.features[0].properties.simpleCalories
    const walk_10_minutes = m2m(walk_10.features[0].properties.duration)
    const date_10 = new Date(walk_10.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_10,
      name: walk_10.features[0].properties.name,
      distance: dist(walk_10.features[0].properties.distance),
      duration: _dot1(walk_10_minutes),
      weights: `b: ${_dot1(cal10W.body / 2.2)}, r: ${_dot1(cal10W.ruck / 2.2)}`,
      simple1: _dot1(walk_10.features[0].properties.simpleCalories),
      simple2: _dot1(walk10Simple),
      pandolf1: _dot1(walk_10.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal10.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_10.features[0].properties.apple.activity),
    })
    console.log(`name: ${walk_10.features[0].properties.name}`)
    console.log(`walk_10 pandolf calories: ${cal10.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_10 pandolf distance: calculated ${_dot1(cal10.totalDistanceM)} `
      + `(original ${_dot1(walk_10.features[0].properties.distance)})`,
    )
    console.log(
      `walk_10 pandolf duration: calculated ${_dot1(cal10.totalDurationSec)}, `
      + `(original ${_dot1(walk_10.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal10.totalDistanceM)}, ${_dot1(walk_10.features[0].properties.distance)}`,
      within5(cal10.totalDistanceM, walk_10.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal10.totalDistanceM, walk_10.features[0].properties.distance),
      `calculated ${_dot1(cal10.totalDistanceM)} /`,
      `original ${_dot1(walk_10.features[0].properties.distance)} =`,
      _dot1(cal10.totalDistanceM) / _dot1(walk_10.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal10.totalKcal, walk10Simple),
      `calculated ${_dot1(cal10.totalKcal)} /`,
      `original ${_dot1(walk10Simple)} =`,
      _dot1(cal10.totalKcal) / _dot1(walk10Simple),
    )
    console.log('within10 calories:', within10(cal10.totalKcal, walk10Simple))
    cal10.segments.map((seg, i) => {
      if (seg.kcal > calClamp) {
        console.log(
          `seg # ${i}, `
          + `seg kcal ${seg.kcal}, `
          + `distance ${seg.horizontalDistance}, `
          + `time ${seg.durationSec}`,
        )
      }
      return 0
    })
  })

  it('Display the results of all the walks tested.', async () => {
    console.log('pandolf function is using seconds instead of milliseconds.')
    console.table(results)
    // assert(false)
  })
})
