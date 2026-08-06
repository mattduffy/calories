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
import walk_35 from './walk_35-you-can-get-multiple-things.json' with { type: 'json' }

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
console.log(`Slope Percentage: ${slope.grade.toFixed(2)}%`)
console.log(`Slope Angle: ${slope.angleDegrees.toFixed(2)} degrees`)

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

describe('what is happening to walk_35?', async () => {
  it('Pandolf calorie comparison test - walk_35', async () => {
    console.log('')
    console.log(`name: ${walk_35.features[0].properties.name}`)
    const cal35W = walk_35.features[0].properties.weights
    console.log('cal35W weights in lbs are:', cal35W)
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
    console.log(cal35.segments)
    results[0].pandolf2 = _dot1(cal35.totalKcal)
    results[0].avgSpd = _dot1(cal35.avgSpeedMs)
    results[0].apple = _dot1(walk_35.features[0].properties?.apple?.activity) ?? 0
    const simple = walk_35.features[0].properties.simpleCalories
    console.log(`walk_35 pandolf calories: ${cal35.totalKcal} (simpleCalories: ${simple})`)
    console.log(
      `walk_35 pandolf distance calculated: ${cal35.totalDistanceM} `
      + `(original ${walk_35.features[0].properties.distance})`,
    )
    console.log(
      `walk_35 pandolf duration calculated: ${cal35.totalDurationSec}, `
      + `(original ${walk_35.features[0].properties.duration / 1000})`,
    )
    console.log(
      'within5 distance: ',
      `${_dot1(cal35.totalDistanceM)}, ${_dot1(walk_35.features[0].properties.distance)}`,
      within5(cal35.totalDistanceM, walk_35.features[0].properties.distance),
    )
    console.log(
      'within10 distance: ',
      within10(cal35.totalDistanceM, walk_35.features[0].properties.distance),
      `calculated ${_dot1(cal35.totalDistanceM)} / `,
      `original ${_dot1(walk_35.features[0].properties.distance)} =`,
      _dot1(cal35.totalDistanceM) / _dot1(walk_35.features[0].properties.distance),
    )
    console.log(
      'within5 calories:',
      within5(cal35.totalKcal, walk35Simple),
      `calculated ${_dot1(cal35.totalKcal)} /`,
      `original ${_dot1(walk35Simple)} =`,
      _dot1(cal35.totalKcal) / _dot1(walk35Simple),
    )
    console.log('within10 calories:', within10(cal35.totalKcal, walk35Simple))
    if (cal35.segments) {
      cal35.segments.map((seg, i) => {
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
    }
    console.table(results)
  })
})
