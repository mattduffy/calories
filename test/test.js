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
  lcdaCalories,
  simpleCalories,
  pandolfCalories,
  calorieEnsemble,
  calculateSlopeGrade,
  minimumMechanicCalories,
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
import walk_15 from './walk_15-we-need-to-go-in-and-find-somebody-pinker.json' with { type: 'json' }
import walk_16 from './walk_16-maybe-just-a-quick-kiss-to-break-the-tension.json' with {
  type: 'json',
}
import walk_17 from './walk_17-when-you-have-nothing-to-loose-there-is-a-certain.json' with {
  type: 'json',
}
import walk_18 from './walk_18-your-new-roommate-is-this-fashion-model.json' with { type: 'json' }
import walk_19 from './walk_19-a-petty-neighbor-murder.json' with { type: 'json' }
import walk_20 from './walk_20-the-de-googled-chromium-browser-youve-been-looking-for.json' with {
  type: 'json'
}
import walk_21 from './walk_21-warehouse-there-house.json' with { type: 'json' }
import walk_22 from './walk_22-guard-else-is-not-what-you-think.json' with { type: 'json' }
import walk_23 from './walk_23-and-the-worm-begins-to-charge.json' with { type: 'json' }
import walk_24 from './walk_24-the-secular-gato-society.json' with { type: 'json' }
import walk_25 from './walk_25-pickle-put-magic-beans-in-their-chili.json' with { type: 'json' }
import walk_26 from './walk_26-which-cardinal-do-you-find-most-sexually-attractive.json' with {
  type: 'json'
}
import walk_27 from './walk_27-my-emergency-cat-costume.json' with { type: 'json' }
import walk_28 from './walk_28-do-you-want-cache-for-your-worker.json' with { type: 'json' }
import walk_29 from './walk_29-denise-richards-is-chair-denier.json' with { type: 'json' }
import walk_30 from './walk_30-take-a-jance-on-me.json' with { type: 'json' }
import walk_31 from './walk_31-i-m-on-unifi.json' with { type: 'json' }
import walk_32 from './walk_32-in-the-vacuum-of-space.json' with { type: 'json' }
import walk_33 from './walk_33-doo-wopping-behind-us.json' with { type: 'json' }
import walk_34 from './walk_34-i-might-as-well-be-gone.json' with { type: 'json' }
import walk_35 from './walk_35-you-can-get-multiple-things.json' with { type: 'json' }
import walk_36 from './walk_36-you-do-it-so-hard-you-get-paralyzed.json' with { type: 'json' }

const latest = walk_36

const __DEBUG__ = (process.env.NODE_ENV === 'development' || process.env.CALORIES_DEBUG)
  ? true : false

function console_log(...args) {
  if (__DEBUG__) {
    console.log(...args)
  }
}

function withinX(m, n, X = 10) {
  const _min = Math.min(m, n)
  const _max = Math.max(m, n)
  // If X% of _max is less than the value of _min, return true.
  const percent = (100 - X) / 100
  console.log('X', X)
  console.log('%', percent)
  console.log('_max', _max)
  console.log(`${percent}% of _max ${percent * _max}`)
  console.log('_min', _min)
  console.log(`${percent * _max} <= ${_min}`)
  // return (Math.floor((X / 100) * _max) <= _min)
  return ((percent * _max) <= _min)
}

const results = [
  {
    date: null,
    name: null,
    distance: null,
    duration: null,
    avgSpd: null,
    weights: null,
    apple: null,
    simple1: null,
    simple2: null,
    pandolf1: null,
    pandolf2: null,
    lcda: null,
    minMech: null,
  },
]

// const skip = { skip: true }
const AGE = 53
const HEIGHT = 64 * 2.54
const SEX = 'm'

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
console_log(`Slope Percentage: ${slope.grade.toFixed(2)}%`)
console_log(`Slope Angle: ${slope.angleDegrees.toFixed(2)} degrees`)

function dist(m) {
  if (m < 1) {
    return '0 km (0 mi)'
  }
  return `${(m / 1000).toFixed(2)} km (${((m / 1000) * 0.6).toFixed(2)} mi)`
}

function _dot1(f) {
  if (!f) {
    return 0
  }
  return Number.parseFloat(f.toFixed(1))
}

function clipName(n) {
  const C = 28
  if (n.length > C) {
    return `${n.slice(0, C)}...`
  }
  return n
}

describe('First test suite for calories package', async () => {
  before(() => {
    console_log('running before the tests')
  })
  after(() => {
    console_log('running after the test')
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
    console_log('name:', walk_1.features[0].properties.name)
    console_log('duration:', walk_1_minutes)
    console_log('difftime:', walk_1_timediff)
    const cals_1 = simpleCalories(walk_1_minutes, weights)
    console_log('just calculated:', cals_1)
    console_log('original value:', walk_1.features[0].properties.simpleCalories)
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
      avgSpd: null,
      weights: `b: ${_dot1(weights.body)}, r: ${_dot1(weights.ruck)}`,
      apple: null,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(cals_1),
      pandolf1: _dot1(walk_1.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: null,
      lcda: null,
      minMech: null,
    })
    const walk_2_minutes = m2m(walk_2.features[0].properties.duration)
    const walk_2_timediff = m2m(walk_2.features[0].properties.endTime)
      - m2m(walk_2.features[0].properties.startTime)
    console_log('name:', walk_2.features[0].properties.name)
    console_log('duration:', walk_2_minutes)
    console_log('difftime:', walk_2_timediff)
    const cals_2 = simpleCalories(walk_2_timediff, weights)
    console_log('just calculated:', cals_2)
    console_log('original value:', walk_2.features[0].properties.simpleCalories)
    console_log('\n\n')
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
      avgSpd: null,
      weights: `b: ${_dot1(weights.body)}, r: ${_dot1(weights.ruck)}`,
      apple: null,
      simple1: _dot1(walk_2.features[0].properties.simpleCalories),
      simple2: _dot1(cals_2),
      pandolf1: _dot1(walk_2.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: null,
      lcda: null,
      minMech: null,
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
})

describe('Pandolf-Santee predictive model tests', async () => {
  it('Pandolf calorie comparison test - walk_01', async () => {
    // const cal1RawDuration = walk_1.features[0].properties.duration
    // const cal2RawDuration = walk_2.features[0].properties.duration
    // const cal3RawDuration = walk_3.features[0].properties.duration

    console_log('\n')
    console_log(`name: ${walk_1.features[0].properties.name}`)
    const cal1W = walk_1.features[0].properties.weights ?? weights
    console_log('cal1W weights in lbs are:', cal1W)
    const cal1 = pandolfCalories(
      walk_1.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal1W.body / 2.2,
        loadKg: cal1W.ruck / 2.2,
        waterKg: (cal1W.water === 0) ? 0 : cal1W.water / 2.2,
        terrain: 1.1,
      },
    )
    results[1].pandolf2 = _dot1(cal1.totalKcal)
    results[1].avgSpd = _dot1(cal1.avgSpeedMs)
    results[1].apple = _dot1(walk_1.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_1.features[0].properties.simpleCalories
    console_log(`walk_1 pandolf calories: ${cal1.totalKcal} (simpleCalories: ${simple})`)
    console_log('within5: ', within5(
      cal1.totalDistanceM,
      walk_1.features[0].properties.distance,
    ))
    console_log('within10: ', within10(
      cal1.totalDistanceM,
      walk_1.features[0].properties.distance,
    ))
    console_log(
      `walk_1 pandolf distance: ${cal1.totalDistanceM} `
      + `(${walk_1.features[0].properties.distance})`,
    )
    console_log(
      `walk_1 pandolf duration: ${cal1.totalDurationSec}, `
      + `(${walk_1.features[0].properties.duration / 1000})`,
    )
    if (cal1.segments) {
      cal1.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('XXX Pandolf calorie comparison test - walk_35', async () => {
    console_log('')
    console_log(`name: ${walk_35.features[0].properties.name}`)
    const cal35W = walk_35.features[0].properties.weights
    console_log('cal35W weights in lbs are:', cal35W)
    const walk35Simple = simpleCalories(
      m2m(walk_35.features[0].properties.duration),
      {
        body: _dot1(cal35W.body / 2.2),
        ruck: _dot1(cal35W.ruck / 2.2),
        water: (cal35W.water === 0) ? 0 : cal35W.water / 2.2,
      },
    )
    const cal35 = pandolfCalories(
      walk_35.features[0].geometry.coordinates,
      {
        bodyWeightKg: cal35W.body / 2.2,
        loadKg: cal35W.ruck / 2.2,
        waterKg: (cal35W.water === 0) ? 0 : cal35W.water / 2.2,
        terrain: 1.1,
        returnSegments: true,
      },
    )
    results[2].pandolf2 = _dot1(cal35.totalKcal)
    results[2].avgSpd = _dot1(cal35.avgSpeedMs)
    results[2].apple = _dot1(walk_35.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_35.features[0].properties.simpleCalories
    console_log(`XXX walk_35 pandolf calories: ${cal35.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `XXX walk_35 pandolf distance calculated: ${cal35.totalDistanceM} `
      + `(original ${walk_35.features[0].properties.distance})`,
    )
    console_log(
      `XXX walk_35 pandolf duration calculated: ${cal35.totalDurationSec}, `
      + `(original ${walk_35.features[0].properties.duration / 1000})`,
    )
    console_log(
      'XXX within5 distance: ',
      `${_dot1(cal35.totalDistanceM)}, ${_dot1(walk_35.features[0].properties.distance)}`,
      within5(cal35.totalDistanceM, walk_35.features[0].properties.distance),
    )
    console_log(
      'XXX within10 distance: ',
      within10(cal35.totalDistanceM, walk_35.features[0].properties.distance),
      `calculated ${_dot1(cal35.totalDistanceM)} / `,
      `original ${_dot1(walk_35.features[0].properties.distance)} =`,
      _dot1(cal35.totalDistanceM) / _dot1(walk_35.features[0].properties.distance),
    )
    console_log(
      'XXX within5 calories:',
      within5(cal35.totalKcal, walk35Simple),
      `calculated ${_dot1(cal35.totalKcal)} /`,
      `original ${_dot1(walk35Simple)} =`,
      _dot1(cal35.totalKcal) / _dot1(walk35Simple),
    )
    console_log('XXX within10 calories:', within10(cal35.totalKcal, walk35Simple))
    if (cal35.segments) {
      cal35.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_02', async () => {
    console_log('')
    console_log(`name: ${walk_2.features[0].properties.name}`)
    const cal2W = walk_2.features[0].properties.weights
    console_log('cal2W weights in lbs are:', cal2W)
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
        bodyWeightKg: cal2W.body / 2.2,
        loadKg: cal2W.ruck / 2.2,
        waterKg: (cal2W.water === 0) ? 0 : cal2W.water / 2.2,
        terrain: 1.1,
      },
    )
    results[2].pandolf2 = _dot1(cal2.totalKcal)
    results[2].avgSpd = _dot1(cal2.avgSpeedMs)
    results[2].apple = _dot1(walk_2.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_2.features[0].properties.simpleCalories
    console_log(`walk_2 pandolf calories: ${cal2.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_2 pandolf distance calculated: ${cal2.totalDistanceM} `
      + `(original ${walk_2.features[0].properties.distance})`,
    )
    console_log(
      `walk_2 pandolf duration calculated: ${cal2.totalDurationSec}, `
      + `(original ${walk_2.features[0].properties.duration / 1000})`,
    )
    console_log(
      'within5 distance: ',
      `${_dot1(cal2.totalDistanceM)}, ${_dot1(walk_2.features[0].properties.distance)}`,
      within5(cal2.totalDistanceM, walk_2.features[0].properties.distance),
    )
    console_log(
      'within10 distance: ',
      within10(cal2.totalDistanceM, walk_2.features[0].properties.distance),
      `calculated ${_dot1(cal2.totalDistanceM)} / `,
      `original ${_dot1(walk_2.features[0].properties.distance)} =`,
      _dot1(cal2.totalDistanceM) / _dot1(walk_2.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal2.totalKcal, walk2Simple),
      `calculated ${_dot1(cal2.totalKcal)} /`,
      `original ${_dot1(walk2Simple)} =`,
      _dot1(cal2.totalKcal) / _dot1(walk2Simple),
    )
    console_log('within10 calories:', within10(cal2.totalKcal, walk2Simple))
    if (cal2.segments) {
      cal2.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_03', async () => {
    console_log('')
    console_log(`name: ${walk_3.features[0].properties.name}`)
    const cal3W = walk_3.features[0].properties.weights
    console_log('cal3W weights in lbs are:', cal3W)
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
      avgSpd: _dot1(cal3.avgSpeedMs),
      weights: `b: ${_dot1(cal3W.body / 2.2)}, r: ${_dot1(cal3W.ruck / 2.2)}`,
      apple: _dot1(walk_3.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk3Simple),
      simple2: _dot1(walk_3.features[0].properties.simpleCalories),
      pandolf1: _dot1(walk_3.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal3.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_3 pandolf calories: ${cal3.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_3 pandolf distance calculated: ${_dot1(cal3.totalDistanceM)} `
      + `(original ${_dot1(walk_3.features[0].properties.distance)})`,
    )
    console_log(
      `walk_3 pandolf duration calculated: ${_dot1(cal3.totalDurationSec)}, `
      + `(original ${_dot1(walk_3.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance: ',
      `${_dot1(cal3.totalDistanceM)}, ${_dot1(walk_3.features[0].properties.distance)}`,
      within5(cal3.totalDistanceM, walk_3.features[0].properties.distance),
    )
    console_log(
      'within10 distance: ',
      within10(cal3.totalDistanceM, walk_3.features[0].properties.distance),
      `calculated ${_dot1(cal3.totalDistanceM)} /`,
      `original ${_dot1(walk_3.features[0].properties.distance)} =`,
      _dot1(cal3.totalDistanceM / walk_3.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal3.totalKcal, walk3Simple),
      `calculated ${_dot1(cal3.totalKcal)} /`,
      `original ${_dot1(walk3Simple)} =`,
      _dot1(cal3.totalKcal) / _dot1(walk3Simple),
    )
    console_log('within10 calories:', within10(cal3.totalKcal, walk3Simple))
    if (cal3.segments) {
      cal3.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_04', async () => {
    console_log('')
    console_log(`name: ${walk_4.features[0].properties.name}`)
    const cal4W = walk_4.features[0].properties.weights ?? weights
    console_log('cal4W weights in lbs are:', cal4W)
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
      avgSpd: _dot1(cal4.avgSpeedMs),
      weights: `b: ${_dot1(cal4W.body / 2.2)}, r: ${_dot1(cal4W.ruck / 2.2)}`,
      apple: _dot1(walk_4.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(simple),
      simple2: _dot1(walk4Simple),
      pandolf1: _dot1(walk_4.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal4.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_4 pandolf calories: ${cal4.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_4 pandolf distance calculated: ${_dot1(cal4.totalDistanceM)} `
      + `(original ${_dot1(walk_4.features[0].properties.distance)})`,
    )
    console_log(
      `walk_4 pandolf duration calculated: ${_dot1(cal4.totalDurationSec)}, `
      + `(original ${_dot1(walk_4.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance: ',
      `${_dot1(cal4.totalDistanceM)}, ${_dot1(walk_4.features[0].properties.distance)}`,
      within5(cal4.totalDistanceM, walk_4.features[0].properties.distance),
    )
    console_log(
      'within10 distance: ',
      within10(cal4.totalDistanceM, walk_4.features[0].properties.distance),
      `calculated ${_dot1(cal4.totalDistance)} /`,
      `original ${_dot1(walk_4.features[0].properties.distance)} =`,
    )
    console_log(
      'within5 calories:',
      within5(cal4.totalKcal, walk4Simple),
      `calculated ${_dot1(cal4.totalKcal)} /`,
      `original ${_dot1(walk4Simple)} =`,
      _dot1(cal4.totalKcal) / _dot1(walk4Simple),
    )
    console_log('within10 calories:', within10(cal4.totalKcal, walk4Simple))
    if (cal4.segments) {
      cal4.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_05', async () => {
    console_log('')
    console_log(`name: ${walk_5.features[0].properties.name}`)
    const cal5W = walk_5.features[0].properties.weights ?? weights
    const walk_5_minutes = m2m(walk_5.features[0].properties.duration)
    console_log('cal5W weights in lbs are:', cal5W)
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
      avgSpd: _dot1(cal5.avgSpeedMs),
      weights: `b: ${cal5W.body / 2.2}, r: ${_dot1(cal5W.ruck / 2.2)}`,
      apple: _dot1(walk_5.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk5Simple),
      pandolf1: _dot1(walk_5.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal5.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_5 pandolf calories: ${cal5.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_5 pandolf distance: ${cal5.totalDistanceM} `
      + `(${walk_5.features[0].properties.distance})`,
    )
    console_log(
      `walk_5 pandolf duration calculated: ${_dot1(cal5.totalDurationSec)}, `
      + `(original ${_dot1(walk_5.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal5.totalDistanceM)}, ${_dot1(walk_5.features[0].properties.distance)}`,
      within5(cal5.totalDistanceM, walk_5.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal5.totalDistanceM, walk_5.features[0].properties.distance),
      `calculated ${_dot1(cal5.totalDistanceM)} /`,
      `original ${_dot1(walk_5.features[0].properties.distance)} =`,
      _dot1(cal5.totalDistanceM) / _dot1(walk_5.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal5.totalKcal, walk5Simple),
      `calculated ${_dot1(cal5.totalKcal)} /`,
      `original ${_dot1(walk5Simple)} =`,
      _dot1(cal5.totalKcal) / _dot1(walk5Simple),
    )
    console_log('within10 calories:', within10(cal5.totalKcal, walk5Simple))
    if (cal5.segments) {
      cal5.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_06', async () => {
    console_log('')
    console_log(`name: ${walk_6.features[0].properties.name}`)
    const walk_6_minutes = m2m(walk_6.features[0].properties.duration)
    const cal6W = walk_6.features[0].properties.weights ?? weights
    console_log('cal6W weights in lbs are:', cal6W)
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
      avgSpd: _dot1(cal6.avgSpeedMs),
      weights: `b: ${_dot1(cal6W.body / 2.2)}, r: ${_dot1(cal6W.ruck / 2.2)}`,
      apple: _dot1(walk_6.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_1.features[0].properties.simpleCalories),
      simple2: _dot1(walk6Simple),
      pandolf1: _dot1(walk_6.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal6.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_6 pandolf calories: ${cal6.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_6 pandolf distance calculated: ${_dot1(cal6.totalDistanceM)} `
      + `(original ${walk_6.features[0].properties.distance})`,
    )
    console_log(
      `walk_6 pandolf duration calculated: ${_dot1(cal6.totalDurationSec)}, `
      + `(original ${walk_6.features[0].properties.duration / 1000})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal6.totalDistanceM)}, ${_dot1(walk_6.features[0].properties.distance)}`,
      within5(cal6.totalDistanceM, walk_6.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal6.totalDistanceM, walk_6.features[0].properties.distance),
      `calculated ${_dot1(cal6.totalDistanceM)} /`,
      `original ${_dot1(walk_6.features[0].properties.distance)} =`,
      _dot1(cal6.totalDistanceM) / _dot1(walk_6.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal6.totalKcal, walk6Simple),
      `calculated ${_dot1(cal6.totalKcal)} /`,
      `original ${_dot1(walk6Simple)} =`,
      _dot1(cal6.totalKcal) / _dot1(walk6Simple),
    )
    console_log('within10 calories:', within10(cal6.totalKcal, walk6Simple))
    if (cal6.segments) {
      cal6.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_07', async () => {
    console_log('')
    console_log(`name: ${walk_7.features[0].properties.name}`)
    const walk_7_minutes = m2m(walk_7.features[0].properties.duration)
    const cal7W = walk_7.features[0].properties.weights ?? weights
    console_log('cal7W weights in lbs are:', cal7W)
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
      avgSpd: _dot1(cal7.avgSpeedMs),
      weights: `b: ${_dot1(cal7W.body / 2.2)}, r: ${_dot1(cal7W.ruck / 2.2)}`,
      apple: _dot1(walk_7.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_7.features[0].properties.simpleCalories),
      simple2: _dot1(walk7Simple),
      pandolf1: _dot1(walk_7.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal7.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_7 pandolf calories: ${cal7.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_7 pandolf distance calculated : ${_dot1(cal7.totalDistanceM)} `
      + `(original ${_dot1(walk_7.features[0].properties.distance)})`,
    )
    console_log(
      `walk_7 pandolf duration calculated: ${_dot1(cal7.totalDurationSec)}, `
      + `(original ${_dot1(walk_7.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal7.totalDistanceM)}, ${_dot1(walk_7.features[0].properties.distance)}`,
      within5(cal7.totalDistanceM, walk_7.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal7.totalDistanceM, walk_7.features[0].properties.distance),
      `calulated ${_dot1(cal7.totalDistanceM)} /`,
      `original ${_dot1(walk_7.features[0].properties.distance)} =`,
      _dot1(cal7.totalDistanceM) / _dot1(walk_7.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal7.totalKcal, walk7Simple),
      `calculated ${_dot1(cal7.totalKcal)} /`,
      `original ${_dot1(walk7Simple)} =`,
      _dot1(cal7.totalKcal) / _dot1(walk7Simple),
    )
    console_log('within10 calories:', within10(cal7.totalKcal, walk7Simple))
    if (cal7.segments) {
      cal7.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_08', async () => {
    console_log('')
    console_log(`name: ${walk_8.features[0].properties.name}`)
    const cal8W = walk_8.features[0].properties.weights ?? weights
    const walk_8_minutes = m2m(walk_8.features[0].properties.duration)
    console_log('cal8W weights in lbs are:', cal8W)
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
      avgSpd: _dot1(cal8.avgSpeedMs),
      weights: `b: ${_dot1(cal8W.body / 2.2)}, r: ${cal8W.ruck / 2.2}`,
      apple: _dot1(walk_8.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_8.features[0].properties.simpleCalories),
      simple2: _dot1(walk8Simple),
      pandolf1: _dot1(walk_8.features[0].properties?.pandolfCalories?.totalKcal) ?? null,
      pandolf2: _dot1(cal8.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_8 pandolf calories: ${cal8.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_8 pandolf distance calculated: ${_dot1(cal8.totalDistanceM)} `
      + `(original ${_dot1(walk_8.features[0].properties.distance)})`,
    )
    console_log(
      `walk_8 pandolf duration calculated: ${_dot1(cal8.totalDurationSec)}, `
      + `(original ${_dot1(walk_8.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal8.totalDistanceM)}, ${_dot1(walk_8.features[0].properties.distance)}`,
      within5(cal8.totalDistanceM, walk_8.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal8.totalDistanceM, walk_8.features[0].properties.distance),
      `calculated ${_dot1(cal8.totalDistanceM)} /`,
      `original ${_dot1(walk_8.features[0].properties.distance)} =`,
      _dot1(cal8.totalDistanceM) / _dot1(walk_8.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal8.totalKcal, walk8Simple),
      `calculated ${_dot1(cal8.totalKcal)} /`,
      `original ${_dot1(walk8Simple)} =`,
      _dot1(cal8.totalKcal) / _dot1(walk8Simple),
    )
    console_log('within10 calories:', within10(cal8.totalKcal, walk8Simple))
    if (cal8.segments) {
      cal8.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_09', async () => {
    console_log('')
    console_log(`name: ${walk_9.features[0].properties.name}`)
    const walk_9_minutes = m2m(walk_9.features[0].properties.duration)
    const cal9W = walk_9.features[0].properties.weights ?? weights
    console_log('cal9W weights in lbs are:', cal9W)
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
      avgSpd: _dot1(cal9.avgSpeedMs),
      weights: `b: ${_dot1(cal9W.body / 2.2)}, r: ${_dot1(cal9W.ruck / 2.2)}`,
      apple: _dot1(walk_9.features[0].properties.apple.activity),
      simple1: _dot1(walk_9.features[0].properties.simpleCalories),
      simple2: _dot1(walk9Simple),
      pandolf1: _dot1(walk_9.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal9.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_9 pandolf calories: ${cal9.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_9 pandolf distance: ${cal9.totalDistanceM} `
      + `(${walk_9.features[0].properties.distance})`,
    )
    console_log(
      `walk_9 pandolf duration calculated: ${_dot1(cal9.totalDurationSec)}, `
      + `(original ${_dot1(walk_9.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal9.totalDistanceM)}, ${_dot1(walk_9.features[0].properties.distance)}`,
      within5(cal9.totalDistanceM, walk_9.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal9.totalDistanceM, walk_9.features[0].properties.distance),
      `calculated ${_dot1(cal9.totalDistanceM)} /`,
      `original ${_dot1(walk_9.features[0].properties.distance)} =`,
      _dot1(cal9.totalDistanceM) / _dot1(walk_9.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal9.totalKcal, walk9Simple),
      `calculated ${_dot1(cal9.totalKcal)} /`,
      `original ${_dot1(walk9Simple)} =`,
      _dot1(cal9.totalKcal) / _dot1(walk9Simple),
    )
    console_log('within10 calories:', within10(cal9.totalKcal, walk9Simple))
    if (cal9.segments) {
      cal9.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_10', async () => {
    console_log('')
    console_log(`name: ${walk_10.features[0].properties.name}`)
    const walk_10_minutes = m2m(walk_10.features[0].properties.duration)
    const cal10W = walk_10.features[0].properties.weights ?? weights
    console_log('cal10W weights in lbs are:', cal10W)
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
      avgSpd: _dot1(cal10.avgSpeedMs),
      weights: `b: ${_dot1(cal10W.body / 2.2)}, r: ${_dot1(cal10W.ruck / 2.2)}`,
      apple: _dot1(walk_10.features[0].properties.apple.activity),
      simple1: _dot1(walk_10.features[0].properties.simpleCalories),
      simple2: _dot1(walk10Simple),
      pandolf1: _dot1(walk_10.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal10.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_10 pandolf calories: ${cal10.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_10 pandolf distance: calculated ${_dot1(cal10.totalDistanceM)} `
      + `(original ${_dot1(walk_10.features[0].properties.distance)})`,
    )
    console_log(
      `walk_10 pandolf duration: calculated ${_dot1(cal10.totalDurationSec)}, `
      + `(original ${_dot1(walk_10.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal10.totalDistanceM)}, ${_dot1(walk_10.features[0].properties.distance)}`,
      within5(cal10.totalDistanceM, walk_10.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal10.totalDistanceM, walk_10.features[0].properties.distance),
      `calculated ${_dot1(cal10.totalDistanceM)} /`,
      `original ${_dot1(walk_10.features[0].properties.distance)} =`,
      _dot1(cal10.totalDistanceM) / _dot1(walk_10.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal10.totalKcal, walk10Simple),
      `calculated ${_dot1(cal10.totalKcal)} /`,
      `original ${_dot1(walk10Simple)} =`,
      _dot1(cal10.totalKcal) / _dot1(walk10Simple),
    )
    console_log('within10 calories:', within10(cal10.totalKcal, walk10Simple))
    if (cal10.segments) {
      cal10.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_11', async () => {
    console_log('')
    console_log(`name: ${walk_11.features[0].properties.name}`)
    const cal11W = walk_11.features[0].properties.weights
    console_log('cal11W weights in lbs are:', cal11W)
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
      avgSpd: _dot1(cal11.avgSpeedMs),
      weights: `b: ${_dot1(cal11W.body / 2.2)}, r: ${_dot1(cal11W.ruck / 2.2)}`,
      apple: _dot1(walk_11.features[0].properties.apple.activity),
      simple1: _dot1(walk_11.features[0].properties.simpleCalories),
      simple2: _dot1(walk11Simple),
      pandolf1: _dot1(walk_11.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal11.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_11 pandolf calories: ${cal11.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_11 pandolf distance: calculated ${_dot1(cal11.totalDistanceM)} `
      + `(original ${_dot1(walk_11.features[0].properties.distance)})`,
    )
    console_log(
      `walk_11 pandolf duration: calculated ${_dot1(cal11.totalDurationSec)}, `
      + `(original ${_dot1(walk_11.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal11.totalDistanceM)}, ${_dot1(walk_11.features[0].properties.distance)}`,
      within5(cal11.totalDistanceM, walk_11.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal11.totalDistanceM, walk_11.features[0].properties.distance),
      `calculated ${_dot1(cal11.totalDistanceM)} /`,
      `original ${_dot1(walk_11.features[0].properties.distance)} =`,
      _dot1(cal11.totalDistanceM) / _dot1(walk_11.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal11.totalKcal, walk11Simple),
      `calculated ${_dot1(cal11.totalKcal)} /`,
      `original ${_dot1(walk11Simple)} =`,
      _dot1(cal11.totalKcal) / _dot1(walk11Simple),
    )
    console_log('within10 calories:', within10(cal11.totalKcal, walk11Simple))
    if (cal11.segments) {
      cal11.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_12', async () => {
    console_log('')
    console_log(`name: ${walk_12.features[0].properties.name}`)
    const walk_12_minutes = m2m(walk_12.features[0].properties.duration)
    const cal12W = walk_12.features[0].properties.weights
    console_log('cal12W weights in lbs are:', cal12W)
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
      avgSpd: _dot1(cal12.avgSpeedMs),
      weights: `b: ${_dot1(cal12W.body / 2.2)}, r: ${_dot1(cal12W.ruck / 2.2)}`,
      apple: _dot1(walk_12.features[0].properties.apple.activity),
      simple1: _dot1(walk_12.features[0].properties.simpleCalories),
      simple2: _dot1(walk12Simple),
      pandolf1: _dot1(walk_12.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal12.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_12 pandolf calories: ${cal12.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_12 pandolf distance: calculated ${_dot1(cal12.totalDistanceM)} `
      + `(original ${_dot1(walk_12.features[0].properties.distance)})`,
    )
    console_log(
      `walk_12 pandolf duration: calculated ${_dot1(cal12.totalDurationSec)}, `
      + `(original ${_dot1(walk_12.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal12.totalDistanceM)}, ${_dot1(walk_12.features[0].properties.distance)}`,
      within5(cal12.totalDistanceM, walk_12.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal12.totalDistanceM, walk_12.features[0].properties.distance),
      `calculated ${_dot1(cal12.totalDistanceM)} /`,
      `original ${_dot1(walk_12.features[0].properties.distance)} =`,
      _dot1(cal12.totalDistanceM) / _dot1(walk_12.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal12.totalKcal, walk12Simple),
      `calculated ${_dot1(cal12.totalKcal)} /`,
      `original ${_dot1(walk12Simple)} =`,
      _dot1(cal12.totalKcal) / _dot1(walk12Simple),
    )
    console_log('within10 calories:', within10(cal12.totalKcal, walk12Simple))
    if (cal12.segments) {
      cal12.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_13', async () => {
    console_log('')
    console_log(`name: ${walk_13.features[0].properties.name}`)
    const cal13W = walk_13.features[0].properties.weights
    const walk_13_minutes = m2m(walk_13.features[0].properties.duration)
    console_log('cal13W weights in lbs are:', cal13W)
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
      avgSpd: _dot1(cal13.avgSpeedMs),
      weights: `b: ${_dot1(cal13W.body / 2.2)}, r: ${_dot1(cal13W.ruck / 2.2)}`,
      apple: _dot1(walk_13.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_13.features[0].properties.simpleCalories),
      simple2: _dot1(walk13Simple),
      pandolf1: _dot1(walk_13.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal13.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_13 pandolf calories: ${cal13.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_13 pandolf distance: calculated ${_dot1(cal13.totalDistanceM)} `
      + `(original ${_dot1(walk_13.features[0].properties.distance)})`,
    )
    console_log(
      `walk_13 pandolf duration: calculated ${_dot1(cal13.totalDurationSec)}, `
      + `(original ${_dot1(walk_13.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal13.totalDistanceM)}, ${_dot1(walk_13.features[0].properties.distance)}`,
      within5(cal13.totalDistanceM, walk_13.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal13.totalDistanceM, walk_13.features[0].properties.distance),
      `calculated ${_dot1(cal13.totalDistanceM)} /`,
      `original ${_dot1(walk_13.features[0].properties.distance)} =`,
      _dot1(cal13.totalDistanceM) / _dot1(walk_13.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal13.totalKcal, walk13Simple),
      `calculated ${_dot1(cal13.totalKcal)} /`,
      `original ${_dot1(walk13Simple)} =`,
      _dot1(cal13.totalKcal) / _dot1(walk13Simple),
    )
    console_log('within10 calories:', within10(cal13.totalKcal, walk13Simple))
    if (cal13.segments) {
      cal13.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_14', async () => {
    console_log('')
    console_log(`name: ${walk_14.features[0].properties.name}`)
    const cal14W = walk_14.features[0].properties.weights
    const walk_14_minutes = m2m(walk_14.features[0].properties.duration)
    console_log('cal14W weights in lbs are:', cal14W)
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
      avgSpd: _dot1(cal14.avgSpeedMs),
      weights: `b: ${_dot1(cal14W.body / 2.2)}, r: ${_dot1(cal14W.ruck / 2.2)}`,
      apple: _dot1(walk_14.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_14.features[0].properties.simpleCalories),
      simple2: _dot1(walk14Simple),
      pandolf1: _dot1(walk_14.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal14.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_14 pandolf calories: ${cal14.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_14 pandolf distance: calculated ${_dot1(cal14.totalDistanceM)} `
      + `(original ${_dot1(walk_14.features[0].properties.distance)})`,
    )
    console_log(
      `walk_14 pandolf duration: calculated ${_dot1(cal14.totalDurationSec)}, `
      + `(original ${_dot1(walk_14.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal14.totalDistanceM)}, ${_dot1(walk_14.features[0].properties.distance)}`,
      within5(cal14.totalDistanceM, walk_14.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal14.totalDistanceM, walk_14.features[0].properties.distance),
      `calculated ${_dot1(cal14.totalDistanceM)} /`,
      `original ${_dot1(walk_14.features[0].properties.distance)} =`,
      _dot1(cal14.totalDistanceM) / _dot1(walk_14.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal14.totalKcal, walk14Simple),
      `calculated ${_dot1(cal14.totalKcal)} /`,
      `original ${_dot1(walk14Simple)} =`,
      _dot1(cal14.totalKcal) / _dot1(walk14Simple),
    )
    console_log('within10 calories:', within10(cal14.totalKcal, walk14Simple))
    if (cal14.segments) {
      cal14.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_15', async () => {
    console_log('')
    console_log(`name: ${walk_15.features[0].properties.name}`)
    const cal15W = walk_15.features[0].properties.weights
    const walk_15_minutes = m2m(walk_15.features[0].properties.duration)
    console_log('cal15W weights in lbs are:', cal15W)
    const walk15Simple = simpleCalories(
      walk_15_minutes,
      {
        body: _dot1(cal15W.body / 2.2),
        ruck: _dot1(cal15W.ruck / 2.2),
        water: (cal15W.water === 0) ? 0 : cal15W.water / 2.2,
      },
    )
    const cal15 = pandolfCalories(
      walk_15.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal15W.body / 2.2),
        loadKg: (cal15W.ruck / 2.2),
        waterKg: (cal15W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_15.features[0].properties.simpleCalories
    const date_15 = new Date(walk_15.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_15,
      name: clipName(walk_15.features[0].properties.name),
      distance: dist(walk_15.features[0].properties.distance),
      duration: _dot1(walk_15_minutes),
      avgSpd: _dot1(cal15.avgSpeedMs),
      weights: `b: ${_dot1(cal15W.body / 2.2)}, r: ${_dot1(cal15W.ruck / 2.2)}`,
      apple: _dot1(walk_15.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_15.features[0].properties.simpleCalories),
      simple2: _dot1(walk15Simple),
      pandolf1: _dot1(walk_15.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal15.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_15 pandolf calories: ${cal15.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_15 pandolf distance: calculated ${_dot1(cal15.totalDistanceM)} `
      + `(original ${_dot1(walk_15.features[0].properties.distance)})`,
    )
    console_log(
      `walk_15 pandolf duration: calculated ${_dot1(cal15.totalDurationSec)}, `
      + `(original ${_dot1(walk_15.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal15.totalDistanceM)}, ${_dot1(walk_15.features[0].properties.distance)}`,
      within5(cal15.totalDistanceM, walk_15.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal15.totalDistanceM, walk_15.features[0].properties.distance),
      `calculated ${_dot1(cal15.totalDistanceM)} /`,
      `original ${_dot1(walk_15.features[0].properties.distance)} =`,
      _dot1(cal15.totalDistanceM) / _dot1(walk_15.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal15.totalKcal, walk15Simple),
      `calculated ${_dot1(cal15.totalKcal)} /`,
      `original ${_dot1(walk15Simple)} =`,
      _dot1(cal15.totalKcal) / _dot1(walk15Simple),
    )
    console_log('within10 calories:', within10(cal15.totalKcal, walk15Simple))
    if (cal15.segments) {
      cal15.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_16', async () => {
    console_log('')
    console_log(`name: ${walk_16.features[0].properties.name}`)
    const cal16W = walk_16.features[0].properties.weights
    const walk_16_minutes = m2m(walk_16.features[0].properties.duration)
    console_log('cal16W weights in lbs are:', cal16W)
    const walk16Simple = simpleCalories(
      walk_16_minutes,
      {
        body: _dot1(cal16W.body / 2.2),
        ruck: _dot1(cal16W.ruck / 2.2),
        water: (cal16W.water === 0) ? 0 : cal16W.water / 2.2,
      },
    )
    const cal16 = pandolfCalories(
      walk_16.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal16W.body / 2.2),
        loadKg: (cal16W.ruck / 2.2),
        waterKg: (cal16W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_16.features[0].properties.simpleCalories
    const date_16 = new Date(walk_16.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_16,
      name: clipName(walk_16.features[0].properties.name),
      distance: dist(walk_16.features[0].properties.distance),
      duration: _dot1(walk_16_minutes),
      avgSpd: _dot1(cal16.avgSpeedMs),
      weights: `b: ${_dot1(cal16W.body / 2.2)}, r: ${_dot1(cal16W.ruck / 2.2)}`,
      apple: _dot1(walk_16.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_16.features[0].properties.simpleCalories),
      simple2: _dot1(walk16Simple),
      pandolf1: _dot1(walk_16.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal16.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_16 pandolf calories: ${cal16.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_16 pandolf distance: calculated ${_dot1(cal16.totalDistanceM)} `
      + `(original ${_dot1(walk_16.features[0].properties.distance)})`,
    )
    console_log(
      `walk_16 pandolf duration: calculated ${_dot1(cal16.totalDurationSec)}, `
      + `(original ${_dot1(walk_16.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal16.totalDistanceM)}, ${_dot1(walk_16.features[0].properties.distance)}`,
      within5(cal16.totalDistanceM, walk_16.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal16.totalDistanceM, walk_16.features[0].properties.distance),
      `calculated ${_dot1(cal16.totalDistanceM)} /`,
      `original ${_dot1(walk_16.features[0].properties.distance)} =`,
      _dot1(cal16.totalDistanceM) / _dot1(walk_16.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal16.totalKcal, walk16Simple),
      `calculated ${_dot1(cal16.totalKcal)} /`,
      `original ${_dot1(walk16Simple)} =`,
      _dot1(cal16.totalKcal) / _dot1(walk16Simple),
    )
    console_log('within10 calories:', within10(cal16.totalKcal, walk16Simple))
    if (cal16.segments) {
      if (cal16.segments.length > 0) {
        cal16.segments.map((seg, i) => {
          if (seg.kcal > calClamp) {
            console_log(
              `seg # ${i}, `
              + `seg kcal ${seg.kcal}, `
              + `distance ${seg.horizontalDistance}, `
              + `time ${seg.durationSec}`,
            )
          }
          return 0
        })
      }
    }
  })

  it('Pandolf calorie comparison test - walk_17', async () => {
    console_log('')
    console_log(`name: ${walk_17.features[0].properties.name}`)
    const cal17W = walk_17.features[0].properties.weights
    const walk_17_minutes = m2m(walk_17.features[0].properties.duration)
    console_log('cal17W weights in lbs are:', cal17W)
    const walk17Simple = simpleCalories(
      walk_17_minutes,
      {
        body: _dot1(cal17W.body / 2.2),
        ruck: _dot1(cal17W.ruck / 2.2),
        water: (cal17W.water === 0) ? 0 : cal17W.water / 2.2,
      },
    )
    const cal17 = pandolfCalories(
      walk_17.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal17W.body / 2.2),
        loadKg: (cal17W.ruck / 2.2),
        waterKg: (cal17W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_17.features[0].properties.simpleCalories
    const date_17 = new Date(walk_17.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_17,
      name: clipName(walk_17.features[0].properties.name),
      distance: dist(walk_17.features[0].properties.distance),
      duration: _dot1(walk_17_minutes),
      avgSpd: _dot1(cal17.avgSpeedMs),
      weights: `b: ${_dot1(cal17W.body / 2.2)}, r: ${_dot1(cal17W.ruck / 2.2)}`,
      apple: _dot1(walk_17.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_17.features[0].properties.simpleCalories),
      simple2: _dot1(walk17Simple),
      pandolf1: _dot1(walk_17.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal17.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_17 pandolf calories: ${cal17.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_17 pandolf distance: calculated ${_dot1(cal17.totalDistanceM)} `
      + `(original ${_dot1(walk_17.features[0].properties.distance)})`,
    )
    console_log(
      `walk_17 pandolf duration: calculated ${_dot1(cal17.totalDurationSec)}, `
      + `(original ${_dot1(walk_17.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal17.totalDistanceM)}, ${_dot1(walk_17.features[0].properties.distance)}`,
      within5(cal17.totalDistanceM, walk_17.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal17.totalDistanceM, walk_17.features[0].properties.distance),
      `calculated ${_dot1(cal17.totalDistanceM)} /`,
      `original ${_dot1(walk_17.features[0].properties.distance)} =`,
      _dot1(cal17.totalDistanceM) / _dot1(walk_17.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal17.totalKcal, walk17Simple),
      `calculated ${_dot1(cal17.totalKcal)} /`,
      `original ${_dot1(walk17Simple)} =`,
      _dot1(cal17.totalKcal) / _dot1(walk17Simple),
    )
    console_log('within10 calories:', within10(cal17.totalKcal, walk17Simple))
    if (cal17.segments?.length > 0) {
      cal17.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_18', async () => {
    console_log('')
    console_log(`name: ${walk_18.features[0].properties.name}`)
    const cal18W = walk_18.features[0].properties.weights
    const walk_18_minutes = m2m(walk_18.features[0].properties.duration)
    console_log('cal18W weights in lbs are:', cal18W)
    const walk18Simple = simpleCalories(
      walk_18_minutes,
      {
        body: _dot1(cal18W.body / 2.2),
        ruck: _dot1(cal18W.ruck / 2.2),
        water: (cal18W.water === 0) ? 0 : cal18W.water / 2.2,
      },
    )
    const cal18 = pandolfCalories(
      walk_18.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal18W.body / 2.2),
        loadKg: (cal18W.ruck / 2.2),
        waterKg: (cal18W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_18.features[0].properties.simpleCalories
    const date_18 = new Date(walk_18.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_18,
      name: clipName(walk_18.features[0].properties.name),
      distance: dist(walk_18.features[0].properties.distance),
      duration: _dot1(walk_18_minutes),
      avgSpd: _dot1(cal18.avgSpeedMs),
      weights: `b: ${_dot1(cal18W.body / 2.2)}, r: ${_dot1(cal18W.ruck / 2.2)}`,
      apple: _dot1(walk_18.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_18.features[0].properties.simpleCalories),
      simple2: _dot1(walk18Simple),
      pandolf1: _dot1(walk_18.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal18.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_18 pandolf calories: ${cal18.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_18 pandolf distance: calculated ${_dot1(cal18.totalDistanceM)} `
      + `(original ${_dot1(walk_18.features[0].properties.distance)})`,
    )
    console_log(
      `walk_18 pandolf duration: calculated ${_dot1(cal18.totalDurationSec)}, `
      + `(original ${_dot1(walk_18.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal18.totalDistanceM)}, ${_dot1(walk_18.features[0].properties.distance)}`,
      within5(cal18.totalDistanceM, walk_18.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal18.totalDistanceM, walk_18.features[0].properties.distance),
      `calculated ${_dot1(cal18.totalDistanceM)} /`,
      `original ${_dot1(walk_18.features[0].properties.distance)} =`,
      _dot1(cal18.totalDistanceM) / _dot1(walk_18.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal18.totalKcal, walk18Simple),
      `calculated ${_dot1(cal18.totalKcal)} /`,
      `original ${_dot1(walk18Simple)} =`,
      _dot1(cal18.totalKcal) / _dot1(walk18Simple),
    )
    console_log('within10 calories:', within10(cal18.totalKcal, walk18Simple))
    if (cal18.segments?.length > 0) {
      cal18.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_19', async () => {
    console_log('')
    console_log(`name: ${walk_19.features[0].properties.name}`)
    const cal19W = walk_19.features[0].properties.weights
    const walk_19_minutes = m2m(walk_19.features[0].properties.duration)
    console_log('cal19W weights in lbs are:', cal19W)
    const walk19Simple = simpleCalories(
      walk_19_minutes,
      {
        body: _dot1(cal19W.body / 2.2),
        ruck: _dot1(cal19W.ruck / 2.2),
        water: (cal19W.water === 0) ? 0 : cal19W.water / 2.2,
      },
    )
    const cal19 = pandolfCalories(
      walk_19.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal19W.body / 2.2),
        loadKg: (cal19W.ruck / 2.2),
        waterKg: (cal19W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_19.features[0].properties.simpleCalories
    const date_19 = new Date(walk_19.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_19,
      name: clipName(walk_19.features[0].properties.name),
      distance: dist(walk_19.features[0].properties.distance),
      duration: _dot1(walk_19_minutes),
      avgSpd: _dot1(cal19.avgSpeedMs),
      weights: `b: ${_dot1(cal19W.body / 2.2)}, r: ${_dot1(cal19W.ruck / 2.2)}`,
      apple: _dot1(walk_19.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_19.features[0].properties.simpleCalories),
      simple2: _dot1(walk19Simple),
      pandolf1: _dot1(walk_19.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal19.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_19 pandolf calories: ${cal19.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_19 pandolf distance: calculated ${_dot1(cal19.totalDistanceM)} `
      + `(original ${_dot1(walk_19.features[0].properties.distance)})`,
    )
    console_log(
      `walk_19 pandolf duration: calculated ${_dot1(cal19.totalDurationSec)}, `
      + `(original ${_dot1(walk_19.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal19.totalDistanceM)}, ${_dot1(walk_19.features[0].properties.distance)}`,
      within5(cal19.totalDistanceM, walk_19.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal19.totalDistanceM, walk_19.features[0].properties.distance),
      `calculated ${_dot1(cal19.totalDistanceM)} /`,
      `original ${_dot1(walk_19.features[0].properties.distance)} =`,
      _dot1(cal19.totalDistanceM) / _dot1(walk_19.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal19.totalKcal, walk19Simple),
      `calculated ${_dot1(cal19.totalKcal)} /`,
      `original ${_dot1(walk19Simple)} =`,
      _dot1(cal19.totalKcal) / _dot1(walk19Simple),
    )
    console_log('within10 calories:', within10(cal19.totalKcal, walk19Simple))
    if (cal19.segments?.length > 0) {
      cal19.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_20', async () => {
    console_log('')
    console_log(`name: ${walk_20.features[0].properties.name}`)
    const cal20W = walk_20.features[0].properties.weights
    const walk_20_minutes = m2m(walk_20.features[0].properties.duration)
    console_log('cal20W weights in lbs are:', cal20W)
    const walk20Simple = simpleCalories(
      walk_20_minutes,
      {
        body: _dot1(cal20W.body / 2.2),
        ruck: _dot1(cal20W.ruck / 2.2),
        water: (cal20W.water === 0) ? 0 : cal20W.water / 2.2,
      },
    )
    const cal20 = pandolfCalories(
      walk_20.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal20W.body / 2.2),
        loadKg: (cal20W.ruck / 2.2),
        waterKg: (cal20W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_20.features[0].properties.simpleCalories
    const date_20 = new Date(walk_20.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_20,
      name: clipName(walk_20.features[0].properties.name),
      distance: dist(walk_20.features[0].properties.distance),
      duration: _dot1(walk_20_minutes),
      avgSpd: _dot1(cal20.avgSpeedMs),
      weights: `b: ${_dot1(cal20W.body / 2.2)}, r: ${_dot1(cal20W.ruck / 2.2)}`,
      apple: _dot1(walk_20.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_20.features[0].properties.simpleCalories),
      simple2: _dot1(walk20Simple),
      pandolf1: _dot1(walk_20.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal20.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_20 pandolf calories: ${cal20.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_20 pandolf distance: calculated ${_dot1(cal20.totalDistanceM)} `
      + `(original ${_dot1(walk_20.features[0].properties.distance)})`,
    )
    console_log(
      `walk_20 pandolf duration: calculated ${_dot1(cal20.totalDurationSec)}, `
      + `(original ${_dot1(walk_20.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal20.totalDistanceM)}, ${_dot1(walk_20.features[0].properties.distance)}`,
      within5(cal20.totalDistanceM, walk_20.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal20.totalDistanceM, walk_20.features[0].properties.distance),
      `calculated ${_dot1(cal20.totalDistanceM)} /`,
      `original ${_dot1(walk_20.features[0].properties.distance)} =`,
      _dot1(cal20.totalDistanceM) / _dot1(walk_20.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal20.totalKcal, walk20Simple),
      `calculated ${_dot1(cal20.totalKcal)} /`,
      `original ${_dot1(walk20Simple)} =`,
      _dot1(cal20.totalKcal) / _dot1(walk20Simple),
    )
    console_log('within10 calories:', within10(cal20.totalKcal, walk20Simple))
    if (cal20.segments?.length > 0) {
      cal20.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_21', async () => {
    console_log('')
    console_log(`name: ${walk_21.features[0].properties.name}`)
    const cal21W = walk_21.features[0].properties.weights
    const walk_21_minutes = m2m(walk_21.features[0].properties.duration)
    console_log('cal21W weights in lbs are:', cal21W)
    const walk21Simple = simpleCalories(
      walk_21_minutes,
      {
        body: _dot1(cal21W.body / 2.2),
        ruck: _dot1(cal21W.ruck / 2.2),
        water: (cal21W.water === 0) ? 0 : cal21W.water / 2.2,
      },
    )
    const cal21 = pandolfCalories(
      walk_21.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal21W.body / 2.2),
        loadKg: (cal21W.ruck / 2.2),
        waterKg: (cal21W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_21.features[0].properties.simpleCalories
    const date_21 = new Date(walk_21.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_21,
      name: clipName(walk_21.features[0].properties.name),
      distance: dist(walk_21.features[0].properties.distance),
      duration: _dot1(walk_21_minutes),
      avgSpd: _dot1(cal21.avgSpeedMs),
      weights: `b: ${_dot1(cal21W.body / 2.2)}, r: ${_dot1(cal21W.ruck / 2.2)}`,
      apple: _dot1(walk_21.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_21.features[0].properties.simpleCalories),
      simple2: _dot1(walk21Simple),
      pandolf1: _dot1(walk_21.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal21.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_21 pandolf calories: ${cal21.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_21 pandolf distance: calculated ${_dot1(cal21.totalDistanceM)} `
      + `(original ${_dot1(walk_21.features[0].properties.distance)})`,
    )
    console_log(
      `walk_21 pandolf duration: calculated ${_dot1(cal21.totalDurationSec)}, `
      + `(original ${_dot1(walk_21.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal21.totalDistanceM)}, ${_dot1(walk_21.features[0].properties.distance)}`,
      within5(cal21.totalDistanceM, walk_21.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal21.totalDistanceM, walk_21.features[0].properties.distance),
      `calculated ${_dot1(cal21.totalDistanceM)} /`,
      `original ${_dot1(walk_21.features[0].properties.distance)} =`,
      _dot1(cal21.totalDistanceM) / _dot1(walk_21.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal21.totalKcal, walk21Simple),
      `calculated ${_dot1(cal21.totalKcal)} /`,
      `original ${_dot1(walk21Simple)} =`,
      _dot1(cal21.totalKcal) / _dot1(walk21Simple),
    )
    console_log('within10 calories:', within10(cal21.totalKcal, walk21Simple))
    if (cal21.segments?.length > 0) {
      cal21.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_22', async () => {
    console_log('')
    console_log(`name: ${walk_22.features[0].properties.name}`)
    const cal22W = walk_22.features[0].properties.weights
    const walk_22_minutes = m2m(walk_22.features[0].properties.duration)
    console_log('cal22W weights in lbs are:', cal22W)
    const walk22Simple = simpleCalories(
      walk_22_minutes,
      {
        body: _dot1(cal22W.body / 2.2),
        ruck: _dot1(cal22W.ruck / 2.2),
        water: (cal22W.water === 0) ? 0 : cal22W.water / 2.2,
      },
    )
    const cal22 = pandolfCalories(
      walk_22.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal22W.body / 2.2),
        loadKg: (cal22W.ruck / 2.2),
        waterKg: (cal22W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_22.features[0].properties.simpleCalories
    const date_22 = new Date(walk_22.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_22,
      name: clipName(walk_22.features[0].properties.name),
      distance: dist(walk_22.features[0].properties.distance),
      duration: _dot1(walk_22_minutes),
      avgSpd: _dot1(cal22.avgSpeedMs),
      weights: `b: ${_dot1(cal22W.body / 2.2)}, r: ${_dot1(cal22W.ruck / 2.2)}`,
      apple: _dot1(walk_22.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_22.features[0].properties.simpleCalories),
      simple2: _dot1(walk22Simple),
      pandolf1: _dot1(walk_22.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal22.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_22 pandolf calories: ${cal22.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_22 pandolf distance: calculated ${_dot1(cal22.totalDistanceM)} `
      + `(original ${_dot1(walk_22.features[0].properties.distance)})`,
    )
    console_log(
      `walk_22 pandolf duration: calculated ${_dot1(cal22.totalDurationSec)}, `
      + `(original ${_dot1(walk_22.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal22.totalDistanceM)}, ${_dot1(walk_22.features[0].properties.distance)}`,
      within5(cal22.totalDistanceM, walk_22.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal22.totalDistanceM, walk_22.features[0].properties.distance),
      `calculated ${_dot1(cal22.totalDistanceM)} /`,
      `original ${_dot1(walk_22.features[0].properties.distance)} =`,
      _dot1(cal22.totalDistanceM) / _dot1(walk_22.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal22.totalKcal, walk22Simple),
      `calculated ${_dot1(cal22.totalKcal)} /`,
      `original ${_dot1(walk22Simple)} =`,
      _dot1(cal22.totalKcal) / _dot1(walk22Simple),
    )
    console_log('within10 calories:', within10(cal22.totalKcal, walk22Simple))
    if (cal22.segments?.length > 0) {
      cal22.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_23', async () => {
    console_log('')
    console_log(`name: ${walk_23.features[0].properties.name}`)
    const cal23W = walk_23.features[0].properties.weights
    const walk_23_minutes = m2m(walk_23.features[0].properties.duration)
    console_log('cal23W weights in lbs are:', cal23W)
    const walk23Simple = simpleCalories(
      walk_23_minutes,
      {
        body: _dot1(cal23W.body / 2.2),
        ruck: _dot1(cal23W.ruck / 2.2),
        water: (cal23W.water === 0) ? 0 : cal23W.water / 2.2,
      },
    )
    const cal23 = pandolfCalories(
      walk_23.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal23W.body / 2.2),
        loadKg: (cal23W.ruck / 2.2),
        waterKg: (cal23W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_23.features[0].properties.simpleCalories
    const date_23 = new Date(walk_23.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_23,
      name: clipName(walk_23.features[0].properties.name),
      distance: dist(walk_23.features[0].properties.distance),
      duration: _dot1(walk_23_minutes),
      avgSpd: _dot1(cal23.avgSpeedMs),
      weights: `b: ${_dot1(cal23W.body / 2.2)}, r: ${_dot1(cal23W.ruck / 2.2)}`,
      apple: _dot1(walk_23.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_23.features[0].properties.simpleCalories),
      simple2: _dot1(walk23Simple),
      pandolf1: _dot1(walk_23.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal23.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_23 pandolf calories: ${cal23.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_23 pandolf distance: calculated ${_dot1(cal23.totalDistanceM)} `
      + `(original ${_dot1(walk_23.features[0].properties.distance)})`,
    )
    console_log(
      `walk_23 pandolf duration: calculated ${_dot1(cal23.totalDurationSec)}, `
      + `(original ${_dot1(walk_23.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal23.totalDistanceM)}, ${_dot1(walk_23.features[0].properties.distance)}`,
      within5(cal23.totalDistanceM, walk_23.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal23.totalDistanceM, walk_23.features[0].properties.distance),
      `calculated ${_dot1(cal23.totalDistanceM)} /`,
      `original ${_dot1(walk_23.features[0].properties.distance)} =`,
      _dot1(cal23.totalDistanceM) / _dot1(walk_23.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal23.totalKcal, walk23Simple),
      `calculated ${_dot1(cal23.totalKcal)} /`,
      `original ${_dot1(walk23Simple)} =`,
      _dot1(cal23.totalKcal) / _dot1(walk23Simple),
    )
    console_log('within10 calories:', within10(cal23.totalKcal, walk23Simple))
    if (cal23.segments?.length > 0) {
      cal23.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_24', async () => {
    console_log('')
    console_log(`name: ${walk_24.features[0].properties.name}`)
    const cal24W = walk_24.features[0].properties.weights
    const walk_24_minutes = m2m(walk_24.features[0].properties.duration)
    console_log('cal24W weights in lbs are:', cal24W)
    const walk24Simple = simpleCalories(
      walk_24_minutes,
      {
        body: _dot1(cal24W.body / 2.2),
        ruck: _dot1(cal24W.ruck / 2.2),
        water: (cal24W.water === 0) ? 0 : cal24W.water / 2.2,
      },
    )
    const cal24 = pandolfCalories(
      walk_24.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal24W.body / 2.2),
        loadKg: (cal24W.ruck / 2.2),
        waterKg: (cal24W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_24.features[0].properties.simpleCalories
    const date_24 = new Date(walk_24.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_24,
      name: clipName(walk_24.features[0].properties.name),
      distance: dist(walk_24.features[0].properties.distance),
      duration: _dot1(walk_24_minutes),
      avgSpd: _dot1(cal24.avgSpeedMs),
      weights: `b: ${_dot1(cal24W.body / 2.2)}, r: ${_dot1(cal24W.ruck / 2.2)}`,
      apple: _dot1(walk_24.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_24.features[0].properties.simpleCalories),
      simple2: _dot1(walk24Simple),
      pandolf1: _dot1(walk_24.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal24.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_24 pandolf calories: ${cal24.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_24 pandolf distance: calculated ${_dot1(cal24.totalDistanceM)} `
      + `(original ${_dot1(walk_24.features[0].properties.distance)})`,
    )
    console_log(
      `walk_24 pandolf duration: calculated ${_dot1(cal24.totalDurationSec)}, `
      + `(original ${_dot1(walk_24.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal24.totalDistanceM)}, ${_dot1(walk_24.features[0].properties.distance)}`,
      within5(cal24.totalDistanceM, walk_24.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal24.totalDistanceM, walk_24.features[0].properties.distance),
      `calculated ${_dot1(cal24.totalDistanceM)} /`,
      `original ${_dot1(walk_24.features[0].properties.distance)} =`,
      _dot1(cal24.totalDistanceM) / _dot1(walk_24.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal24.totalKcal, walk24Simple),
      `calculated ${_dot1(cal24.totalKcal)} /`,
      `original ${_dot1(walk24Simple)} =`,
      _dot1(cal24.totalKcal) / _dot1(walk24Simple),
    )
    console_log('within10 calories:', within10(cal24.totalKcal, walk24Simple))
    if (cal24.segments?.length > 0) {
      cal24.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })

  it('Pandolf calorie comparison test - walk_25', async () => {
    console_log('')
    console_log(`name: ${walk_25.features[0].properties.name}`)
    const cal25W = walk_25.features[0].properties.weights
    const walk_25_minutes = m2m(walk_25.features[0].properties.duration)
    console_log('cal25W weights in lbs are:', cal25W)
    const walk25Simple = simpleCalories(
      walk_25_minutes,
      {
        body: _dot1(cal25W.body / 2.2),
        ruck: _dot1(cal25W.ruck / 2.2),
        water: (cal25W.water === 0) ? 0 : cal25W.water / 2.2,
      },
    )
    const cal25 = pandolfCalories(
      walk_25.features[0].geometry.coordinates,
      {
        bodyWeightKg: (cal25W.body / 2.2),
        loadKg: (cal25W.ruck / 2.2),
        waterKg: (cal25W.water / 2.2),
        terrain: 1.1,
      },
    )
    const simple = walk_25.features[0].properties.simpleCalories
    const date_25 = new Date(walk_25.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    results.push({
      date: date_25,
      name: clipName(walk_25.features[0].properties.name),
      distance: dist(walk_25.features[0].properties.distance),
      duration: _dot1(walk_25_minutes),
      avgSpd: _dot1(cal25.avgSpeedMs),
      weights: `b: ${_dot1(cal25W.body / 2.2)}, r: ${_dot1(cal25W.ruck / 2.2)}`,
      apple: _dot1(walk_25.features[0].properties?.apple?.activity) ?? 0,
      simple1: _dot1(walk_25.features[0].properties.simpleCalories),
      simple2: _dot1(walk25Simple),
      pandolf1: _dot1(walk_25.features[0].properties.pandolfCalories.totalKcal) ?? null,
      pandolf2: _dot1(cal25.totalKcal),
      lcda: null,
      minMech: null,
    })
    console_log(`walk_25 pandolf calories: ${cal25.totalKcal} (simpleCalories: ${simple})`)
    console_log(
      `walk_25 pandolf distance: calculated ${_dot1(cal25.totalDistanceM)} `
      + `(original ${_dot1(walk_25.features[0].properties.distance)})`,
    )
    console_log(
      `walk_25 pandolf duration: calculated ${_dot1(cal25.totalDurationSec)}, `
      + `(original ${_dot1(walk_25.features[0].properties.duration / 1000)})`,
    )
    console_log(
      'within5 distance:',
      `${_dot1(cal25.totalDistanceM)}, ${_dot1(walk_25.features[0].properties.distance)}`,
      within5(cal25.totalDistanceM, walk_25.features[0].properties.distance),
    )
    console_log(
      'within10 distance:',
      within10(cal25.totalDistanceM, walk_25.features[0].properties.distance),
      `calculated ${_dot1(cal25.totalDistanceM)} /`,
      `original ${_dot1(walk_25.features[0].properties.distance)} =`,
      _dot1(cal25.totalDistanceM) / _dot1(walk_25.features[0].properties.distance),
    )
    console_log(
      'within5 calories:',
      within5(cal25.totalKcal, walk25Simple),
      `calculated ${_dot1(cal25.totalKcal)} /`,
      `original ${_dot1(walk25Simple)} =`,
      _dot1(cal25.totalKcal) / _dot1(walk25Simple),
    )
    console_log('within10 calories:', within10(cal25.totalKcal, walk25Simple))
    if (cal25.segments?.length > 0) {
      cal25.segments.map((seg, i) => {
        if (seg.kcal > calClamp) {
          console_log(
            `seg # ${i}, `
            + `seg kcal ${seg.kcal}, `
            + `distance ${seg.horizontalDistance}, `
            + `time ${seg.durationSec}`,
          )
        }
        return 0
      })
    }
  })
})

describe('LCDA predictive model suite', async () => {
  it('Lcda predictive model with walk_1', async () => {
    console_log('')
    console_log(`name: ${walk_1.features[0].properties.name}`)
    const coords = walk_1.features[0].geometry.coordinates
    const weight = walk_1.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[1].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_2', async () => {
    console_log('')
    console_log(`name: ${walk_2.features[0].properties.name}`)
    const coords = walk_2.features[0].geometry.coordinates
    const weight = walk_2.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[2].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_3', async () => {
    console_log('')
    console_log(`name: ${walk_3.features[0].properties.name}`)
    const coords = walk_3.features[0].geometry.coordinates
    const weight = walk_3.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[3].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_4', async () => {
    console_log('')
    console_log(`name: ${walk_4.features[0].properties.name}`)
    const coords = walk_4.features[0].geometry.coordinates
    const weight = walk_4.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[4].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_5', async () => {
    console_log('')
    console_log(`name: ${walk_5.features[0].properties.name}`)
    const coords = walk_5.features[0].geometry.coordinates
    const weight = walk_5.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[5].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_6', async () => {
    console_log('')
    console_log(`name: ${walk_6.features[0].properties.name}`)
    const coords = walk_6.features[0].geometry.coordinates
    const weight = walk_6.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[6].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_7', async () => {
    console_log('')
    console_log(`name: ${walk_7.features[0].properties.name}`)
    const coords = walk_7.features[0].geometry.coordinates
    const weight = walk_7.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[7].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_8', async () => {
    console_log('')
    console_log(`name: ${walk_8.features[0].properties.name}`)
    const coords = walk_8.features[0].geometry.coordinates
    const weight = walk_8.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[8].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_9', async () => {
    console_log('')
    console_log(`name: ${walk_9.features[0].properties.name}`)
    const coords = walk_9.features[0].geometry.coordinates
    const weight = walk_9.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[9].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_10', async () => {
    console_log('')
    console_log(`name: ${walk_10.features[0].properties.name}`)
    const coords = walk_10.features[0].geometry.coordinates
    const weight = walk_10.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[10].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_11', async () => {
    console_log('')
    console_log(`name: ${walk_11.features[0].properties.name}`)
    const coords = walk_11.features[0].geometry.coordinates
    const weight = walk_11.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,

    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[11].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_12', async () => {
    console_log('')
    console_log(`name: ${walk_12.features[0].properties.name}`)
    const coords = walk_12.features[0].geometry.coordinates
    const weight = walk_12.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[12].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_13', async () => {
    console_log('')
    console_log(`name: ${walk_13.features[0].properties.name}`)
    const coords = walk_13.features[0].geometry.coordinates
    const weight = walk_13.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[13].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_14', async () => {
    console_log('')
    console_log(`name: ${walk_14.features[0].properties.name}`)
    const coords = walk_14.features[0].geometry.coordinates
    const weight = walk_14.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[14].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_15', async () => {
    console_log('')
    console_log(`name: ${walk_15.features[0].properties.name}`)
    const coords = walk_15.features[0].geometry.coordinates
    const weight = walk_15.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[15].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_16', async () => {
    console_log('')
    console_log(`name: ${walk_16.features[0].properties.name}`)
    const coords = walk_16.features[0].geometry.coordinates
    const weight = walk_16.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[16].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_17', async () => {
    console_log('')
    console_log(`name: ${walk_17.features[0].properties.name}`)
    const coords = walk_17.features[0].geometry.coordinates
    const weight = walk_17.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[17].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_18', async () => {
    console_log('')
    console_log(`name: ${walk_18.features[0].properties.name}`)
    const coords = walk_18.features[0].geometry.coordinates
    const weight = walk_18.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[18].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_19', async () => {
    console_log('')
    console_log(`name: ${walk_19.features[0].properties.name}`)
    const coords = walk_19.features[0].geometry.coordinates
    const weight = walk_19.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[19].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_20', async () => {
    console_log('')
    console_log(`name: ${walk_20.features[0].properties.name}`)
    const coords = walk_20.features[0].geometry.coordinates
    const weight = walk_20.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[20].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_21', async () => {
    console_log('')
    console_log(`name: ${walk_21.features[0].properties.name}`)
    const coords = walk_21.features[0].geometry.coordinates
    const weight = walk_21.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[21].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_22', async () => {
    console_log('')
    console_log(`name: ${walk_22.features[0].properties.name}`)
    const coords = walk_22.features[0].geometry.coordinates
    const weight = walk_22.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[22].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_23', async () => {
    console_log('')
    console_log(`name: ${walk_23.features[0].properties.name}`)
    const coords = walk_23.features[0].geometry.coordinates
    const weight = walk_23.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[23].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_24', async () => {
    console_log('')
    console_log(`name: ${walk_24.features[0].properties.name}`)
    const coords = walk_24.features[0].geometry.coordinates
    const weight = walk_24.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[24].lcda = _dot1(lcda.totalKcal)
  })

  it('Lcda predictive model with walk_25', async () => {
    console_log('')
    console_log(`name: ${walk_25.features[0].properties.name}`)
    const coords = walk_25.features[0].geometry.coordinates
    const weight = walk_25.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const lcda = lcdaCalories(coords, bmr, details)
    console_log(lcda)
    results[25].lcda = _dot1(lcda.totalKcal)
  })
})

describe('Minimum Mechanics predictive model', async () => {
  it('missing parameters should fail', async () => {
    const coords = latest.features[0].geometry.coordinates
    const bmr = {
      height: HEIGHT,
      age: AGE,
      sex: SEX,
      weight: latest.features[0].properties.weights.body / 2.2,
    }
    const options = {
      bodyWeightKg: latest.features[0].properties.weights.body / 2.2,
      loadKg: latest.features[0].properties.weights.ruck / 2.2,
      waterkg: 0,
      terrain: 1.1,
    }
    assert.throws(() => { minimumMechanicCalories([], bmr, options) })
    assert.throws(() => { minimumMechanicCalories(coords, null, options) })
    assert.throws(() => { minimumMechanicCalories(coords, bmr, null) })
    const minMac = minimumMechanicCalories(coords, bmr, options)
    console_log('minMac', minMac)
  })

  it('Minimum Mechanics predictive model with walk_1', async () => {
    console_log('')
    console_log(`name: ${walk_1.features[0].properties.name}`)
    const coords = walk_1.features[0].geometry.coordinates
    const weight = walk_1.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[1].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_2', async () => {
    console_log('')
    console_log(`name: ${walk_2.features[0].properties.name}`)
    const coords = walk_2.features[0].geometry.coordinates
    const weight = walk_2.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[2].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_3', async () => {
    console_log('')
    console_log(`name: ${walk_3.features[0].properties.name}`)
    const coords = walk_3.features[0].geometry.coordinates
    const weight = walk_3.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[3].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_4', async () => {
    console_log('')
    console_log(`name: ${walk_4.features[0].properties.name}`)
    const coords = walk_4.features[0].geometry.coordinates
    const weight = walk_4.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[4].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_5', async () => {
    console_log('')
    console_log(`name: ${walk_5.features[0].properties.name}`)
    const coords = walk_5.features[0].geometry.coordinates
    const weight = walk_5.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[5].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_6', async () => {
    console_log('')
    console_log(`name: ${walk_6.features[0].properties.name}`)
    const coords = walk_6.features[0].geometry.coordinates
    const weight = walk_6.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[6].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_7', async () => {
    console_log('')
    console_log(`name: ${walk_7.features[0].properties.name}`)
    const coords = walk_7.features[0].geometry.coordinates
    const weight = walk_7.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[7].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_8', async () => {
    console_log('')
    console_log(`name: ${walk_8.features[0].properties.name}`)
    const coords = walk_8.features[0].geometry.coordinates
    const weight = walk_8.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[8].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_9', async () => {
    console_log('')
    console_log(`name: ${walk_9.features[0].properties.name}`)
    const coords = walk_9.features[0].geometry.coordinates
    const weight = walk_9.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[9].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_10', async () => {
    console_log('')
    console_log(`name: ${walk_10.features[0].properties.name}`)
    const coords = walk_10.features[0].geometry.coordinates
    const weight = walk_10.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[10].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_11', async () => {
    console_log('')
    console_log(`name: ${walk_11.features[0].properties.name}`)
    const coords = walk_11.features[0].geometry.coordinates
    const weight = walk_11.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[11].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_12', async () => {
    console_log('')
    console_log(`name: ${walk_12.features[0].properties.name}`)
    const coords = walk_12.features[0].geometry.coordinates
    const weight = walk_12.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[12].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_13', async () => {
    console_log('')
    console_log(`name: ${walk_13.features[0].properties.name}`)
    const coords = walk_13.features[0].geometry.coordinates
    const weight = walk_13.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[13].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_14', async () => {
    console_log('')
    console_log(`name: ${walk_14.features[0].properties.name}`)
    const coords = walk_14.features[0].geometry.coordinates
    const weight = walk_14.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[14].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_15', async () => {
    console_log('')
    console_log(`name: ${walk_15.features[0].properties.name}`)
    const coords = walk_15.features[0].geometry.coordinates
    const weight = walk_15.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[15].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_16', async () => {
    console_log('')
    console_log(`name: ${walk_16.features[0].properties.name}`)
    const coords = walk_16.features[0].geometry.coordinates
    const weight = walk_16.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[16].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_17', async () => {
    console_log('')
    console_log(`name: ${walk_17.features[0].properties.name}`)
    const coords = walk_17.features[0].geometry.coordinates
    const weight = walk_17.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[17].minMech = _dot1(minMech.totalKcal)
  })
  it('Minimum Mechanics predictive model with walk_18', async () => {
    console_log('')
    console_log(`name: ${walk_18.features[0].properties.name}`)
    const coords = walk_18.features[0].geometry.coordinates
    const weight = walk_18.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[18].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_19', async () => {
    console_log('')
    console_log(`name: ${walk_19.features[0].properties.name}`)
    const coords = walk_19.features[0].geometry.coordinates
    const weight = walk_19.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[19].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_20', async () => {
    console_log('')
    console_log(`name: ${walk_20.features[0].properties.name}`)
    const coords = walk_20.features[0].geometry.coordinates
    const weight = walk_20.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[20].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_21', async () => {
    console_log('')
    console_log(`name: ${walk_21.features[0].properties.name}`)
    const coords = walk_21.features[0].geometry.coordinates
    const weight = walk_21.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[21].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_22', async () => {
    console_log('')
    console_log(`name: ${walk_22.features[0].properties.name}`)
    const coords = walk_22.features[0].geometry.coordinates
    const weight = walk_22.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[22].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_23', async () => {
    console_log('')
    console_log(`name: ${walk_23.features[0].properties.name}`)
    const coords = walk_23.features[0].geometry.coordinates
    const weight = walk_23.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[23].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_24', async () => {
    console_log('')
    console_log(`name: ${walk_24.features[0].properties.name}`)
    const coords = walk_24.features[0].geometry.coordinates
    const weight = walk_24.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[24].minMech = _dot1(minMech.totalKcal)
  })

  it('Minimum Mechanics predictive model with walk_25', async () => {
    console_log('')
    console_log(`name: ${walk_25.features[0].properties.name}`)
    const coords = walk_25.features[0].geometry.coordinates
    const weight = walk_25.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
    }
    const minMech = minimumMechanicCalories(coords, bmr, details)
    console_log(minMech)
    results[25].minMech = _dot1(minMech.totalKcal)
  })
})

describe('Calorie ensemble tests', async () => {
  it('calorieEnsemble test', async () => {
    console_log('')
    console_log('calorie ensemble function test using the latest data file')
    const coords = latest.features[0].geometry.coordinates
    const weight = latest.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_26', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_26 data file')
    const coords = walk_26.features[0].geometry.coordinates
    const date_26 = new Date(walk_26.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_26.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk26Simple = simpleCalories(
      m2m(walk_26.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_26,
      name: clipName(walk_26.features[0].properties.name),
      distance: dist(walk_26.features[0].properties.distance),
      duration: _dot1(m2m(walk_26.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_26.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_26.features[0].properties.apple.activity,
      simple1: _dot1(walk_26.features[0].properties.simpleCalories),
      simple2: _dot1(walk26Simple),
      pandolf1: _dot1(walk_26.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_27', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_27 data file')
    const coords = walk_27.features[0].geometry.coordinates
    const date_27 = new Date(walk_27.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_27.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk27Simple = simpleCalories(
      m2m(walk_27.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_27,
      name: clipName(walk_27.features[0].properties.name),
      distance: dist(walk_27.features[0].properties.distance),
      duration: _dot1(m2m(walk_27.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_27.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_27.features[0].properties.apple.activity,
      simple1: _dot1(walk_27.features[0].properties.simpleCalories),
      simple2: _dot1(walk27Simple),
      pandolf1: _dot1(walk_27.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_28', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_28 data file')
    const coords = walk_28.features[0].geometry.coordinates
    const date_28 = new Date(walk_28.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_28.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk28Simple = simpleCalories(
      m2m(walk_28.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_28,
      name: clipName(walk_28.features[0].properties.name),
      distance: dist(walk_28.features[0].properties.distance),
      duration: _dot1(m2m(walk_28.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_28.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_28.features[0].properties.apple.activity,
      simple1: _dot1(walk_28.features[0].properties.simpleCalories),
      simple2: _dot1(walk28Simple),
      pandolf1: _dot1(walk_28.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_29', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_29 data file')
    const coords = walk_29.features[0].geometry.coordinates
    const date_29 = new Date(walk_29.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_29.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk29Simple = simpleCalories(
      m2m(walk_29.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_29,
      name: clipName(walk_29.features[0].properties.name),
      distance: dist(walk_29.features[0].properties.distance),
      duration: _dot1(m2m(walk_29.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_29.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_29.features[0].properties.apple.activity,
      simple1: _dot1(walk_29.features[0].properties.simpleCalories),
      simple2: _dot1(walk29Simple),
      pandolf1: _dot1(walk_29.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_30', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_30 data file')
    const coords = walk_30.features[0].geometry.coordinates
    const date_30 = new Date(walk_30.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_30.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk30Simple = simpleCalories(
      m2m(walk_30.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_30,
      name: clipName(walk_30.features[0].properties.name),
      distance: dist(walk_30.features[0].properties.distance),
      duration: _dot1(m2m(walk_30.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_30.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_30.features[0].properties.apple.activity,
      simple1: _dot1(walk_30.features[0].properties.simpleCalories),
      simple2: _dot1(walk30Simple),
      pandolf1: _dot1(walk_30.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_31', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_31 data file')
    const coords = walk_31.features[0].geometry.coordinates
    const date_31 = new Date(walk_31.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_31.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk31Simple = simpleCalories(
      m2m(walk_31.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_31,
      name: clipName(walk_31.features[0].properties.name),
      distance: dist(walk_31.features[0].properties.distance),
      duration: _dot1(m2m(walk_31.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_31.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_31.features[0].properties.apple.activity,
      simple1: _dot1(walk_31.features[0].properties.simpleCalories),
      simple2: _dot1(walk31Simple),
      pandolf1: _dot1(walk_31.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_32', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_32 data file')
    const coords = walk_32.features[0].geometry.coordinates
    const date_32 = new Date(walk_32.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_32.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk32Simple = simpleCalories(
      m2m(walk_32.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_32,
      name: clipName(walk_32.features[0].properties.name),
      distance: dist(walk_32.features[0].properties.distance),
      duration: _dot1(m2m(walk_32.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_32.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_32.features[0].properties.apple.activity,
      simple1: _dot1(walk_32.features[0].properties.simpleCalories),
      simple2: _dot1(walk32Simple),
      pandolf1: _dot1(walk_32.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_33', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_33 data file')
    const coords = walk_33.features[0].geometry.coordinates
    const date_33 = new Date(walk_33.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_33.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk33Simple = simpleCalories(
      m2m(walk_33.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_33,
      name: clipName(walk_33.features[0].properties.name),
      distance: dist(walk_33.features[0].properties.distance),
      duration: _dot1(m2m(walk_33.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_33.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_33.features[0].properties.apple.activity,
      simple1: _dot1(walk_33.features[0].properties.simpleCalories),
      simple2: _dot1(walk33Simple),
      pandolf1: _dot1(walk_33.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_34', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_34 data file')
    const coords = walk_34.features[0].geometry.coordinates
    const date_34 = new Date(walk_34.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_34.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk34Simple = simpleCalories(
      m2m(walk_34.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_34,
      name: clipName(walk_34.features[0].properties.name),
      distance: dist(walk_34.features[0].properties.distance),
      duration: _dot1(m2m(walk_34.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_34.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_34.features[0].properties.apple.activity,
      simple1: _dot1(walk_34.features[0].properties.simpleCalories),
      simple2: _dot1(walk34Simple),
      pandolf1: _dot1(walk_34.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_35', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_35 data file')
    const coords = walk_35.features[0].geometry.coordinates
    const date_35 = new Date(walk_35.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_35.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      BMR: bmr,
    }
    const walk35Simple = simpleCalories(
      m2m(walk_35.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_35,
      name: clipName(walk_35.features[0].properties.name),
      distance: dist(walk_35.features[0].properties.distance),
      duration: _dot1(m2m(walk_35.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_35.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_35.features[0].properties.apple.activity,
      simple1: _dot1(walk_35.features[0].properties.simpleCalories),
      simple2: _dot1(walk35Simple),
      pandolf1: _dot1(walk_35.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
  })

  it('calorieEnsemble test - walk_36', async () => {
    console_log('')
    console_log('calorie ensemble function test using walk_36 data file')
    const coords = walk_36.features[0].geometry.coordinates
    const date_36 = new Date(walk_36.features[0].properties.date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    const weight = walk_36.features[0].properties.weights
    const bodyW = _dot1(weight.body / 2.2)
    const ruckW = _dot1(weight.ruck / 2.2)
    const bmr = {
      height: HEIGHT, weight: bodyW, age: AGE, sex: SEX,
    }
    const details = {
      bodyWeightKg: bodyW,
      loadKg: ruckW,
      waterKg: 0,
      terrain: 1.1,
      smooth: true,
      smoothWindow: 1,
      BMR: bmr,
    }
    const walk36Simple = simpleCalories(
      m2m(walk_36.features[0].properties.duration),
      {
        body: _dot1(weight.body / 2.2),
        ruck: _dot1(weight.ruck / 2.2),
        water: 0,
      },
    )
    const resultSet = calorieEnsemble(coords, details)
    console_log(resultSet)
    results.push({
      date: date_36,
      name: clipName(walk_36.features[0].properties.name),
      distance: dist(walk_36.features[0].properties.distance),
      duration: _dot1(m2m(walk_36.features[0].properties.duration)),
      avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
      weights: walk_36.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        + `r: ${_dot1(weight.ruck / 2.2)}`,
      apple: walk_36.features[0].properties.apple.activity,
      simple1: _dot1(walk_36.features[0].properties.simpleCalories),
      simple2: _dot1(walk36Simple),
      pandolf1: _dot1(walk_36.features[0].properties.pandolfCalories.totalKcal),
      pandolf2: _dot1(resultSet.pandolf.totalKcal),
      lcda: _dot1(resultSet.lcda.totalKcal),
      minMech: _dot1(resultSet.minMech.totalKcal),
    })
    // assert(within10(resultSet.pandolf.totalKcal, resultSet.lcda.totalKcal))
    const X = 32
    const pKcal = resultSet.pandolf.totalKcal
    const lKcal = resultSet.lcda.totalKcal
    console.log(
      `% diff ${Number.parseInt(Math.min(pKcal, lKcal) / Math.max(pKcal, lKcal) * 100)}%`,
    )
    // console.log(`withinX ${pKcal} ${lKcal}where X is ${X}, ${withinX(pKcal, lKcal, X)}`)
    assert(withinX(pKcal, lKcal, X))
  })
})

describe('Results table', async () => {
  it('Display the results of all the walks tested.', async () => {
    // console_log('pandolf function is using seconds instead of milliseconds.')
    console.table(results)
    assert(true)
  })
})
