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
import walk_11 from './walk_11-1-ring-to-rule-the-mall.json' with { type: 'json' }
import walk_12 from './walk_12-15-points-of-bludgeoning-damage.json' with { type: 'json' }
import walk_13 from './walk_13-wait-you-can-fuck-your-bank.json' with { type: 'json' }
import walk_14 from './walk_14-Its-a-little-bit-annoying.json' with { type: 'json' }

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
    return 0
  }
  return Number.parseFloat(f.toFixed(1))
}

function clipName(n) {
  const C = 35
  if (n.length > C) {
    return `${n.slice(0, 35)}...`
  }
  return n
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
      name: clipName(walk_1.features[0].properties.name),
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
      name: clipName(walk_2.features[0].properties.name),
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

    console.log('\n')
    console.log(`name: ${walk_1.features[0].properties.name}`)
    const cal1W = walk_1.features[0].properties.weights ?? weights
    console.log('cal1W weights in lbs are:', cal1W)
    const cal1 = pandolfCalories(
      walk_1.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal1W.body, loadKg: cal1W.ruck, waterKg: cal1W.water, terrain: 1.1,
      },
    )
    results[1].pandolf2 = _dot1(cal1.totalKcal)
    results[1].apple = _dot1(walk_1.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_1.features[0].properties.simpleCalories
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
    console.log(`name: ${walk_2.features[0].properties.name}`)
    const cal2W = walk_2.features[0].properties.weights
    console.log('cal2W weights in lbs are:', cal2W)
    const walk2Simple = simpleCalories(
      m2m(walk_2.features[0].properties.duration),
      {
        body: _dot1(cal2W.body / 2.2),
        ruck: _dot1(cal2W.ruck / 2.2),
        water: (cal2W.water === 0) ? 0 : cal2W.water / 2.2,
      },
    )
    const cal2 = pandolfCalories(
      walk_2.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal2W.body, loadKg: cal2W.ruck, waterKg: cal2W.water, terrain: 1.1,
      },
    )
    results[2].pandolf2 = _dot1(cal2.totalKcal)
    results[2].apple = _dot1(walk_2.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_2.features[0].properties.simpleCalories
    console.log(`walk_2 pandolf calories: ${cal2.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_2 pandolf distance calculated: ${cal2.totalDistanceM} `
      + `(original ${walk_2.features[0].properties.distance})`,
    )
    console.log(
      `walk_2 pandolf duration calculated: ${cal2.totalDurationSec}, `
      + `(original ${walk_2.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance: ',
      `${_dot1(cal2.totalDistanceM)}, ${_dot1(walk_2.features[0].properties.distance)}`,
      within5(cal2.totalDistanceM, walk_2.features[0].properties.distance),
    )
    console.log(
      'within10 distance: ',
      within10(cal2.totalDistanceM, walk_2.features[0].properties.distance),
      `calculated ${_dot1(cal2.totalDistanceM)} / `,
      `original ${_dot1(walk_2.features[0].properties.distance)} =`,
      _dot1(cal2.totalDistanceM) / _dot1(walk_2.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal2.totalKcal, walk2Simple),
      `calculated ${_dot1(cal2.totalKcal)} /`,
      `original ${_dot1(walk2Simple)} =`,
      _dot1(cal2.totalKcal) / _dot1(walk2Simple),
    )
    console.log('within10 calories:', within10(cal2.totalKcal, walk2Simple))
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
    console.log(`name: ${walk_3.features[0].properties.name}`)
    const cal3W = walk_3.features[0].properties.weights
    console.log('cal3W weights in lbs are:', cal3W)
    const walk_3_minutes = m2m(walk_3.features[0].properties.duration)
    const walk3Simple = simpleCalories(
      walk_3_minutes,
      {
        body: _dot1(cal3W.body / 2.2),
        ruck: _dot1(cal3W.ruck / 2.2),
        water: (cal3W.water === 0) ? 0 : cal3W.water / 2.2,
      },
    )
    const cal3 = pandolfCalories(
      walk_3.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal3W.body / 2.2),
        loadKg: (cal3W.ruck / 2.2),
        waterKg: (cal3W.water / 2.2),
        terrain: 1.1,
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
      name: clipName(walk_3.features[0].properties.name),
      distance: dist(walk_3.features[0].properties.distance),
      duration: _dot1(m2m(walk_3.features[0].properties.duration)),
      weights: `b: ${_dot1(cal3W.body / 2.2)}, r: ${_dot1(cal3W.ruck / 2.2)}`,
      simple1: _dot1(walk3Simple),
      simple2: _dot1(walk_3.features[0].properties.simpleCalories),
      pandolf1: _dot1(walk_3.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal3.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_3.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_3 pandolf calories: ${cal3.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_3 pandolf distance calculated: ${_dot1(cal3.totalDistanceM)} `
      + `(original ${_dot1(walk_3.features[0].properties.distance)})`,
    )
    console.log(
      `walk_3 pandolf duration calculated: ${_dot1(cal3.totalDurationSec)}, `
      + `(original ${_dot1(walk_3.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance: ',
      `${_dot1(cal3.totalDistanceM)}, ${_dot1(walk_3.features[0].properties.distance)}`,
      within5(cal3.totalDistanceM, walk_3.features[0].properties.distance),
    )
    console.log(
      'within10 distance: ',
      within10(cal3.totalDistanceM, walk_3.features[0].properties.distance),
      `calculated ${_dot1(cal3.totalDistanceM)} /`,
      `original ${_dot1(walk_3.features[0].properties.distance)} =`,
      _dot1(cal3.totalDistanceM / walk_3.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal3.totalKcal, walk3Simple),
      `calculated ${_dot1(cal3.totalKcal)} /`,
      `original ${_dot1(walk3Simple)} =`,
      _dot1(cal3.totalKcal) / _dot1(walk3Simple),
    )
    console.log('within10 calories:', within10(cal3.totalKcal, walk3Simple))
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
    console.log(`name: ${walk_4.features[0].properties.name}`)
    const cal4W = walk_4.features[0].properties.weights ?? weights
    console.log('cal4W weights in lbs are:', cal4W)
    const walk_4_minutes = m2m(walk_4.features[0].properties.duration)
    const walk4Simple = simpleCalories(
      walk_4_minutes,
      {
        body: _dot1(cal4W.body / 2.2),
        ruck: _dot1(cal4W.ruck / 2.2) ?? 0,
        water: (cal4W.water === 0) ? 0 : cal4W.water / 2.2,
      },
    )
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
    const date_4 = new Date(walk_4.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_4,
      name: clipName(walk_4.features[0].properties.name),
      distance: dist(walk_4.features[0].properties.distance),
      duration: _dot1(walk_4_minutes),
      weights: `b: ${_dot1(cal4W.body / 2.2)}, r: ${_dot1(cal4W.ruck / 2.2)}`,
      simple1: _dot1(simple),
      simple2: _dot1(walk4Simple),
      pandolf1: _dot1(walk_4.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal4.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_4.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_4 pandolf calories: ${cal4.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_4 pandolf distance calculated: ${_dot1(cal4.totalDistanceM)} `
      + `(original ${_dot1(walk_4.features[0].properties.distance)})`,
    )
    console.log(
      `walk_4 pandolf duration calculated: ${_dot1(cal4.totalDurationSec)}, `
      + `(original ${_dot1(walk_4.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance: ',
      `${_dot1(cal4.totalDistanceM)}, ${_dot1(walk_4.features[0].properties.distance)}`,
      within5(cal4.totalDistanceM, walk_4.features[0].properties.distance),
    )
    console.log(
      'within10 distance: ',
      within10(cal4.totalDistanceM, walk_4.features[0].properties.distance),
      `calculated ${_dot1(cal4.totalDistance)} /`,
      `original ${_dot1(walk_4.features[0].properties.distance)} =`,
    )
    console.log(
      'within5 calories:',
      within5(cal4.totalKcal, walk4Simple),
      `calculated ${_dot1(cal4.totalKcal)} /`,
      `original ${_dot1(walk4Simple)} =`,
      _dot1(cal4.totalKcal) / _dot1(walk4Simple),
    )
    console.log('within10 calories:', within10(cal4.totalKcal, walk4Simple))
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
  })

  it('Advanced calorie comparison test - walk_05', async () => {
    console.log('')
    console.log(`name: ${walk_5.features[0].properties.name}`)
    const cal5W = walk_5.features[0].properties.weights ?? weights
    const walk_5_minutes = m2m(walk_5.features[0].properties.duration)
    console.log('cal5W weights in lbs are:', cal5W)
    const walk5Simple = simpleCalories(
      walk_5_minutes,
      {
        body: _dot1(cal5W.body / 2.2),
        ruck: _dot1(cal5W.ruck / 2.2),
        water: (cal5W.water === 0) ? 0 : cal5W.water / 2.2,
      },
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
    const date_5 = new Date(walk_5.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_5,
      name: clipName(walk_5.features[0].properties.name),
      distance: dist(walk_5.features[0].properties.distance),
      duration: _dot1(walk_5_minutes),
      weights: `b: ${cal5W.body / 2.2}, r: ${_dot1(cal5W.ruck / 2.2)}`,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk5Simple),
      pandolf1: _dot1(walk_5.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal5.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_5.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_5 pandolf calories: ${cal5.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_5 pandolf distance: ${cal5.totalDistanceM} `
      + `(${walk_5.features[0].properties.distance})`,
    )
    console.log(
      `walk_5 pandolf duration calculated: ${_dot1(cal5.totalDurationSec)}, `
      + `(original ${_dot1(walk_5.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal5.totalDistanceM)}, ${_dot1(walk_5.features[0].properties.distance)}`,
      within5(cal5.totalDistanceM, walk_5.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal5.totalDistanceM, walk_5.features[0].properties.distance),
      `calculated ${_dot1(cal5.totalDistanceM)} /`,
      `original ${_dot1(walk_5.features[0].properties.distance)} =`,
      _dot1(cal5.totalDistanceM) / _dot1(walk_5.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal5.totalKcal, walk5Simple),
      `calculated ${_dot1(cal5.totalKcal)} /`,
      `original ${_dot1(walk5Simple)} =`,
      _dot1(cal5.totalKcal) / _dot1(walk5Simple),
    )
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
    console.log(`name: ${walk_6.features[0].properties.name}`)
    const walk_6_minutes = m2m(walk_6.features[0].properties.duration)
    const cal6W = walk_6.features[0].properties.weights ?? weights
    console.log('cal6W weights in lbs are:', cal6W)
    const walk6Simple = simpleCalories(
      walk_6_minutes,
      {
        body: _dot1(cal6W.body / 2.2),
        ruck: _dot1(cal6W.ruck / 2.2),
        water: (cal6W.water === 0) ? 0 : cal6W.water / 2.2,
      },
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
    const date_6 = new Date(walk_6.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_6,
      name: clipName(walk_6.features[0].properties.name),
      distance: dist(walk_6.features[0].properties.distance),
      duration: _dot1(walk_6_minutes),
      weights: `b: ${_dot1(cal6W.body / 2.2)}, r: ${_dot1(cal6W.ruck / 2.2)}`,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk6Simple),
      pandolf1: _dot1(walk_6.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal6.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_6.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_6 pandolf calories: ${cal6.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_6 pandolf distance calculated: ${_dot1(cal6.totalDistanceM)} `
      + `(original ${walk_6.features[0].properties.distance})`,
    )
    console.log(
      `walk_6 pandolf duration calculated: ${_dot1(cal6.totalDurationSec)}, `
      + `(original ${walk_6.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal6.totalDistanceM)}, ${_dot1(walk_6.features[0].properties.distance)}`,
      within5(cal6.totalDistanceM, walk_6.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal6.totalDistanceM, walk_6.features[0].properties.distance),
      `calculated ${_dot1(cal6.totalDistanceM)} /`,
      `original ${_dot1(walk_6.features[0].properties.distance)} =`,
      _dot1(cal6.totalDistanceM) / _dot1(walk_6.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal6.totalKcal, walk6Simple),
      `calculated ${_dot1(cal6.totalKcal)} /`,
      `original ${_dot1(walk6Simple)} =`,
      _dot1(cal6.totalKcal) / _dot1(walk6Simple),
    )
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
    console.log(`name: ${walk_7.features[0].properties.name}`)
    const walk_7_minutes = m2m(walk_7.features[0].properties.duration)
    const cal7W = walk_7.features[0].properties.weights ?? weights
    console.log('cal7W weights in lbs are:', cal7W)
    const walk7Simple = simpleCalories(
      walk_7_minutes,
      {
        body: _dot1(cal7W.body / 2.2),
        ruck: _dot1(cal7W.ruck / 2.2),
        water: (cal7W.water === 0) ? 0 : cal7W.water / 2.2,
      },
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
    const date_7 = new Date(walk_7.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_7,
      name: clipName(walk_7.features[0].properties.name),
      distance: dist(walk_7.features[0].properties.distance),
      duration: _dot1(walk_7_minutes),
      weights: `b: ${_dot1(cal7W.body / 2.2)}, r: ${_dot1(cal7W.ruck / 2.2)}`,
      simple1: _dot1(walk_7.features[0].properties.simpleCalories),
      simple2: _dot1(walk7Simple),
      pandolf1: _dot1(walk_7.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal7.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_7.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_7 pandolf calories: ${cal7.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_7 pandolf distance calculated : ${_dot1(cal7.totalDistanceM)} `
      + `(original ${_dot1(walk_7.features[0].properties.distance)})`,
    )
    console.log(
      `walk_7 pandolf duration calculated: ${_dot1(cal7.totalDurationSec)}, `
      + `(original ${_dot1(walk_7.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal7.totalDistanceM)}, ${_dot1(walk_7.features[0].properties.distance)}`,
      within5(cal7.totalDistanceM, walk_7.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal7.totalDistanceM, walk_7.features[0].properties.distance),
      `calulated ${_dot1(cal7.totalDistanceM)} /`,
      `original ${_dot1(walk_7.features[0].properties.distance)} =`,
      _dot1(cal7.totalDistanceM) / _dot1(walk_7.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal7.totalKcal, walk7Simple),
      `calculated ${_dot1(cal7.totalKcal)} /`,
      `original ${_dot1(walk7Simple)} =`,
      _dot1(cal7.totalKcal) / _dot1(walk7Simple),
    )
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
    console.log(`name: ${walk_8.features[0].properties.name}`)
    const cal8W = walk_8.features[0].properties.weights ?? weights
    const walk_8_minutes = m2m(walk_8.features[0].properties.duration)
    console.log('cal8W weights in lbs are:', cal8W)
    const walk8Simple = simpleCalories(
      walk_8_minutes,
      {
        body: _dot1(cal8W.body / 2.2),
        ruck: _dot1(cal8W.ruck / 2.2),
        water: (cal8W.water === 0) ? 0 : cal8W.water / 2.2,
      },
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
    const date_8 = new Date(walk_8.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_8,
      name: clipName(walk_8.features[0].properties.name),
      distance: dist(walk_8.features[0].properties.distance),
      duration: _dot1(walk_8_minutes),
      weights: `b: ${_dot1(cal8W.body / 2.2)}, r: ${cal8W.ruck / 2.2}`,
      simple1: _dot1(walk_8.features[0].properties.simpleCalories),
      simple2: _dot1(walk8Simple),
      pandolf1: _dot1(walk_8.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal8.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_8.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_8 pandolf calories: ${cal8.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_8 pandolf distance calculated: ${_dot1(cal8.totalDistanceM)} `
      + `(original ${_dot1(walk_8.features[0].properties.distance)})`,
    )
    console.log(
      `walk_8 pandolf duration calculated: ${_dot1(cal8.totalDurationSec)}, `
      + `(original ${_dot1(walk_8.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal8.totalDistanceM)}, ${_dot1(walk_8.features[0].properties.distance)}`,
      within5(cal8.totalDistanceM, walk_8.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal8.totalDistanceM, walk_8.features[0].properties.distance),
      `calculated ${_dot1(cal8.totalDistanceM)} /`,
      `original ${_dot1(walk_8.features[0].properties.distance)} =`,
      _dot1(cal8.totalDistanceM) / _dot1(walk_8.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal8.totalKcal, walk8Simple),
      `calculated ${_dot1(cal8.totalKcal)} /`,
      `original ${_dot1(walk8Simple)} =`,
      _dot1(cal8.totalKcal) / _dot1(walk8Simple),
    )
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
    console.log(`name: ${walk_9.features[0].properties.name}`)
    const walk_9_minutes = m2m(walk_9.features[0].properties.duration)
    const cal9W = walk_9.features[0].properties.weights ?? weights
    console.log('cal9W weights in lbs are:', cal9W)
    const walk9Simple = simpleCalories(
      walk_9_minutes,
      {
        body: _dot1(cal9W.body / 2.2),
        ruck: _dot1(cal9W.ruck / 2.2),
        water: (cal9W.water === 0) ? 0 : cal9W.water / 2.2,
      },
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
    const date_9 = new Date(walk_9.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_9,
      name: clipName(walk_9.features[0].properties.name),
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
    console.log(`walk_9 pandolf calories: ${cal9.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_9 pandolf distance: ${cal9.totalDistanceM} `
      + `(${walk_9.features[0].properties.distance})`,
    )
    console.log(
      `walk_9 pandolf duration calculated: ${_dot1(cal9.totalDurationSec)}, `
      + `(original ${_dot1(walk_9.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal9.totalDistanceM)}, ${_dot1(walk_9.features[0].properties.distance)}`,
      within5(cal9.totalDistanceM, walk_9.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal9.totalDistanceM, walk_9.features[0].properties.distance),
      `calculated ${_dot1(cal9.totalDistanceM)} /`,
      `original ${_dot1(walk_9.features[0].properties.distance)} =`,
      _dot1(cal9.totalDistanceM) / _dot1(walk_9.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal9.totalKcal, walk9Simple),
      `calculated ${_dot1(cal9.totalKcal)} /`,
      `original ${_dot1(walk9Simple)} =`,
      _dot1(cal9.totalKcal) / _dot1(walk9Simple),
    )
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
    console.log(`name: ${walk_10.features[0].properties.name}`)
    const walk_10_minutes = m2m(walk_10.features[0].properties.duration)
    const cal10W = walk_10.features[0].properties.weights ?? weights
    console.log('cal10W weights in lbs are:', cal10W)
    const walk10Simple = simpleCalories(
      walk_10_minutes,
      {
        body: _dot1(cal10W.body / 2.2),
        ruck: _dot1(cal10W.ruck / 2.2),
        water: (cal10W.water === 0) ? 0 : cal10W.water / 2.2,
      },
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
    const date_10 = new Date(walk_10.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_10,
      name: clipName(walk_10.features[0].properties.name),
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

  it('Advanced calorie comparison test - walk_11', async () => {
    console.log('')
    console.log(`name: ${walk_11.features[0].properties.name}`)
    const cal11W = walk_11.features[0].properties.weights
    console.log('cal11W weights in lbs are:', cal11W)
    const walk_11_minutes = m2m(walk_11.features[0].properties.duration)
    const walk11Simple = simpleCalories(
      walk_11_minutes,
      {
        body: _dot1(cal11W.body / 2.2),
        ruck: _dot1(cal11W.ruck / 2.2),
        water: (cal11W.water === 0) ? 0 : cal11W.water / 2.2,
      },
    )
    const cal11 = pandolfCalories(
      walk_11.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal11W.body / 2.2),
        loadKg: (cal11W.ruck / 2.2),
        waterKg: (cal11W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_11.features[0].properties.simpleCalories
    const date_11 = new Date(walk_11.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_11,
      name: clipName(walk_11.features[0].properties.name),
      distance: dist(walk_11.features[0].properties.distance),
      duration: _dot1(walk_11_minutes),
      weights: `b: ${_dot1(cal11W.body / 2.2)}, r: ${_dot1(cal11W.ruck / 2.2)}`,
      simple1: _dot1(walk_11.features[0].properties.simpleCalories),
      simple2: _dot1(walk11Simple),
      pandolf1: _dot1(walk_11.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal11.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_11.features[0].properties.apple.activity),
    })
    console.log(`walk_11 pandolf calories: ${cal11.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_11 pandolf distance: calculated ${_dot1(cal11.totalDistanceM)} `
      + `(original ${_dot1(walk_11.features[0].properties.distance)})`,
    )
    console.log(
      `walk_11 pandolf duration: calculated ${_dot1(cal11.totalDurationSec)}, `
      + `(original ${_dot1(walk_11.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal11.totalDistanceM)}, ${_dot1(walk_11.features[0].properties.distance)}`,
      within5(cal11.totalDistanceM, walk_11.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal11.totalDistanceM, walk_11.features[0].properties.distance),
      `calculated ${_dot1(cal11.totalDistanceM)} /`,
      `original ${_dot1(walk_11.features[0].properties.distance)} =`,
      _dot1(cal11.totalDistanceM) / _dot1(walk_11.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal11.totalKcal, walk11Simple),
      `calculated ${_dot1(cal11.totalKcal)} /`,
      `original ${_dot1(walk11Simple)} =`,
      _dot1(cal11.totalKcal) / _dot1(walk11Simple),
    )
    console.log('within10 calories:', within10(cal11.totalKcal, walk11Simple))
    cal11.segments.map((seg, i) => {
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

  it('Advanced calorie comparison test - walk_12', async () => {
    console.log('')
    console.log(`name: ${walk_12.features[0].properties.name}`)
    const walk_12_minutes = m2m(walk_12.features[0].properties.duration)
    const cal12W = walk_12.features[0].properties.weights
    console.log('cal12W weights in lbs are:', cal12W)
    const walk12Simple = simpleCalories(
      walk_12_minutes,
      {
        body: _dot1(cal12W.body / 2.2),
        ruck: _dot1(cal12W.ruck / 2.2),
        water: (cal12W.water === 0) ? 0 : cal12W.water / 2.2,
      },
    )
    const cal12 = pandolfCalories(
      walk_12.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal12W.body / 2.2),
        loadKg: (cal12W.ruck / 2.2),
        waterKg: (cal12W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_12.features[0].properties.simpleCalories
    const date_12 = new Date(walk_12.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_12,
      name: clipName(walk_12.features[0].properties.name),
      distance: dist(walk_12.features[0].properties.distance),
      duration: _dot1(walk_12_minutes),
      weights: `b: ${_dot1(cal12W.body / 2.2)}, r: ${_dot1(cal12W.ruck / 2.2)}`,
      simple1: _dot1(walk_12.features[0].properties.simpleCalories),
      simple2: _dot1(walk12Simple),
      pandolf1: _dot1(walk_12.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal12.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_12.features[0].properties.apple.activity),
    })
    console.log(`walk_12 pandolf calories: ${cal12.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_12 pandolf distance: calculated ${_dot1(cal12.totalDistanceM)} `
      + `(original ${_dot1(walk_12.features[0].properties.distance)})`,
    )
    console.log(
      `walk_12 pandolf duration: calculated ${_dot1(cal12.totalDurationSec)}, `
      + `(original ${_dot1(walk_12.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal12.totalDistanceM)}, ${_dot1(walk_12.features[0].properties.distance)}`,
      within5(cal12.totalDistanceM, walk_12.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal12.totalDistanceM, walk_12.features[0].properties.distance),
      `calculated ${_dot1(cal12.totalDistanceM)} /`,
      `original ${_dot1(walk_12.features[0].properties.distance)} =`,
      _dot1(cal12.totalDistanceM) / _dot1(walk_12.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal12.totalKcal, walk12Simple),
      `calculated ${_dot1(cal12.totalKcal)} /`,
      `original ${_dot1(walk12Simple)} =`,
      _dot1(cal12.totalKcal) / _dot1(walk12Simple),
    )
    console.log('within10 calories:', within10(cal12.totalKcal, walk12Simple))
    cal12.segments.map((seg, i) => {
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

  it('Advanced calorie comparison test - walk_13', async () => {
    console.log('')
    console.log(`name: ${walk_13.features[0].properties.name}`)
    const cal13W = walk_13.features[0].properties.weights
    const walk_13_minutes = m2m(walk_13.features[0].properties.duration)
    console.log('cal13W weights in lbs are:', cal13W)
    const walk13Simple = simpleCalories(
      walk_13_minutes,
      {
        body: _dot1(cal13W.body / 2.2),
        ruck: _dot1(cal13W.ruck / 2.2),
        water: (cal13W.water === 0) ? 0 : cal13W.water / 2.2,
      },
    )
    const cal13 = pandolfCalories(
      walk_13.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal13W.body / 2.2),
        loadKg: (cal13W.ruck / 2.2),
        waterKg: (cal13W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_13.features[0].properties.simpleCalories
    const date_13 = new Date(walk_13.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_13,
      name: clipName(walk_13.features[0].properties.name),
      distance: dist(walk_13.features[0].properties.distance),
      duration: _dot1(walk_13_minutes),
      weights: `b: ${_dot1(cal13W.body / 2.2)}, r: ${_dot1(cal13W.ruck / 2.2)}`,
      simple1: _dot1(walk_13.features[0].properties.simpleCalories),
      simple2: _dot1(walk13Simple),
      pandolf1: _dot1(walk_13.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal13.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_13.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_13 pandolf calories: ${cal13.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_13 pandolf distance: calculated ${_dot1(cal13.totalDistanceM)} `
      + `(original ${_dot1(walk_13.features[0].properties.distance)})`,
    )
    console.log(
      `walk_13 pandolf duration: calculated ${_dot1(cal13.totalDurationSec)}, `
      + `(original ${_dot1(walk_13.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal13.totalDistanceM)}, ${_dot1(walk_13.features[0].properties.distance)}`,
      within5(cal13.totalDistanceM, walk_13.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal13.totalDistanceM, walk_13.features[0].properties.distance),
      `calculated ${_dot1(cal13.totalDistanceM)} /`,
      `original ${_dot1(walk_13.features[0].properties.distance)} =`,
      _dot1(cal13.totalDistanceM) / _dot1(walk_13.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal13.totalKcal, walk13Simple),
      `calculated ${_dot1(cal13.totalKcal)} /`,
      `original ${_dot1(walk13Simple)} =`,
      _dot1(cal13.totalKcal) / _dot1(walk13Simple),
    )
    console.log('within10 calories:', within10(cal13.totalKcal, walk13Simple))
    cal13.segments.map((seg, i) => {
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

  it('Advanced calorie comparison test - walk_14', async () => {
    console.log('')
    console.log(`name: ${walk_14.features[0].properties.name}`)
    const cal14W = walk_14.features[0].properties.weights
    const walk_14_minutes = m2m(walk_14.features[0].properties.duration)
    console.log('cal14W weights in lbs are:', cal14W)
    const walk14Simple = simpleCalories(
      walk_14_minutes,
      {
        body: _dot1(cal14W.body / 2.2),
        ruck: _dot1(cal14W.ruck / 2.2),
        water: (cal14W.water === 0) ? 0 : cal14W.water / 2.2,
      },
    )
    const cal14 = pandolfCalories(
      walk_14.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal14W.body / 2.2),
        loadKg: (cal14W.ruck / 2.2),
        waterKg: (cal14W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_14.features[0].properties.simpleCalories
    const date_14 = new Date(walk_14.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_14,
      name: clipName(walk_14.features[0].properties.name),
      distance: dist(walk_14.features[0].properties.distance),
      duration: _dot1(walk_14_minutes),
      weights: `b: ${_dot1(cal14W.body / 2.2)}, r: ${_dot1(cal14W.ruck / 2.2)}`,
      simple1: _dot1(walk_14.features[0].properties.simpleCalories),
      simple2: _dot1(walk14Simple),
      pandolf1: _dot1(walk_14.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal14.totalKcal),
      minimumMech: null,
      apple: _dot1(walk_14.features[0].properties?.apple?.activity) ?? 0,
    })
    console.log(`walk_14 pandolf calories: ${cal14.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_14 pandolf distance: calculated ${_dot1(cal14.totalDistanceM)} `
      + `(original ${_dot1(walk_14.features[0].properties.distance)})`,
    )
    console.log(
      `walk_14 pandolf duration: calculated ${_dot1(cal14.totalDurationSec)}, `
      + `(original ${_dot1(walk_14.features[0].properties.duration / 1000)})`,
    )
    console.log(
      'within5 distance:',
      `${_dot1(cal14.totalDistanceM)}, ${_dot1(walk_14.features[0].properties.distance)}`,
      within5(cal14.totalDistanceM, walk_14.features[0].properties.distance),
    )
    console.log(
      'within10 distance:',
      within10(cal14.totalDistanceM, walk_14.features[0].properties.distance),
      `calculated ${_dot1(cal14.totalDistanceM)} /`,
      `original ${_dot1(walk_14.features[0].properties.distance)} =`,
      _dot1(cal14.totalDistanceM) / _dot1(walk_14.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal14.totalKcal, walk14Simple),
      `calculated ${_dot1(cal14.totalKcal)} /`,
      `original ${_dot1(walk14Simple)} =`,
      _dot1(cal14.totalKcal) / _dot1(walk14Simple),
    )
    console.log('within10 calories:', within10(cal14.totalKcal, walk14Simple))
    cal14.segments.map((seg, i) => {
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
