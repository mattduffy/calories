/* eslint-disable camelcase */
import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { argv } from 'node:process'
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
import { ramerDouglasPeucker } from '../util/rdp.js'
import walk_35 from './walk_35-you-can-get-multiple-things.json' with { type: 'json' }
import walk_36 from './walk_36-you-do-it-so-hard-you-get-paralyzed.json' with { type: 'json' }
import walk_37 from './walk_37-i-m-am-fucking-reckless.json' with { type: 'json' }
import walk_38 from './walk_38-you-are-gonna-be-person.json' with { type: 'json' }
import walk_39 from './walk_39-hospitals-make-him-really-nervous.json' with { type: 'json' }
import walk_40 from './walk_40-sit-back-and-enjoy-the-show.json' with { type: 'json' }
import walk_41 from './walk_41-roasted-dicks-of-course.json' with { type: 'json' }
import walk_42 from './walk_42-as-you-wee-around-the-room.json' with { type: 'json' }
import walk_43 from './walk_43-a-budding-friendship.json' with { type: 'json' }
import walk_44 from './walk_44-let-me-borrow-a-dracula.json' with { type: 'json' }
import walk_45 from './walk_45-those-days-are-dead-and-gone.json' with { type: 'json' }
import walk_46 from './walk_46-the-turrlett-family.json' with { type: 'json' }
import walk_47 from './walk_47-my-twitter-acounts-been-hacked.json' with { type: 'json' }

// console.log(argv)
let _e = null
const _eDefault = 1.1
argv.slice(3,).find((arg) => {
  const yeah = /epsilon=(?<e>[\d.]+)$/.exec(arg)?.groups.e
  if (yeah) {
    console.log('setting epsilon to provided value:', yeah)
    _e = yeah
    return true
  }
  console.log('using default epsilon value:', _eDefault)
  return false
})

const EPSILON = _e || _eDefault
const SMOOTH = false
const SMOOTH_WINDOW = 5

const walks = {
  walk_35, walk_36, walk_37, walk_38, walk_39, walk_40,
  walk_41, walk_42, walk_43, walk_44, walk_45, walk_47,
}

const results = []

const result = {
  date: null,
  name: null,
  dist: null,
  dist_s: null,
  duration: null,
  avgSpd: null,
  pandolf: null,
  pandolf_s: null,
  lcda: null,
  lcda_s: null,
  minMech: null,
  minMech_s: null,
}
// const skip = { skip: true }
const AGE = 53
const HEIGHT = 64 * 2.54
const SEX = 'm'

const weights = {
  body: 70, // (160 / 2.2),
  ruck: 5, // (30 / 2.2), water: 0,
}

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

describe('what is happens to calries when track is simplified?', async () => {
  it('test walk_35 thru walk_47 simplified tracks', async () => {
    // walks.map((walk) => {
    Object.entries(walks).forEach(([name, walk]) => {
      const __filename = fileURLToPath(import.meta.url)
      const parts = path.parse(__filename)
      // console.log(parts)
      const newPath = `${parts.dir}/simplified-${name}.json`
      // console.log('simplified walk file name:', newPath)
      const coords = walk.features[0].geometry.coordinates
      const coords_s = ramerDouglasPeucker(walk.features[0].geometry.coordinates, EPSILON)
      const date = new Date(walk.features[0].properties.date)
        .toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })
      const weight = walk.features[0].properties.weights
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
        smooth: SMOOTH,
        smoothWindow: SMOOTH_WINDOW,
        BMR: bmr,
      }
      const resultSet = calorieEnsemble(coords, details)
      // console.log(resultSet)
      const resultSet_s = calorieEnsemble(coords_s, details)
      // console.log(resultSet_s)
      results.push({
        // date: date,
        name: clipName(walk.features[0].properties.name),
        // distance: dist(walk.features[0].properties.distance),
        // distance_s: dist(walk.features[0].properties.distance),
        duration: _dot1(m2m(walk.features[0].properties.duration)),
        avgSpd: _dot1(resultSet.pandolf.avgSpeedMs),
        // weights: walk.features[0].weights = `b: ${_dot1(weight.body / 2.2)}, `
        //   + `r: ${_dot1(weight.ruck / 2.2)}`,
        lengths: `epslion: ${EPSILON}, ${coords.length}, ${coords_s.length}`,
        pandolf_o: _dot1(walk.features[0].properties.pandolfCalories.totalKcal),
        pandolf_l: _dot1(resultSet.pandolf.totalKcal),
        pandolf_s: _dot1(resultSet_s.pandolf.totalKcal),
        lcda_o: _dot1(walk.features[0].properties.lcdaCalories.totalKcal),
        lcda_l: _dot1(resultSet.lcda.totalKcal),
        lcda_s: _dot1(resultSet_s.lcda.totalKcal),
        minMech_o: _dot1(walk.features[0].properties?.minimumMechanicsCalories?.totalKcal || 0),
        minMech_l: _dot1(resultSet.minMech.totalKcal),
        minMech_s: _dot1(resultSet_s.minMech.totalKcal),
      })
      try {
        walk.features[0].geometry.coordinates = coords_s
        console.log('shorted coords track:', walk.features[0].geometry.coordinates.length)
        writeFileSync(newPath, JSON.toString(walk), { encoding: 'utf8' })
      } catch (e) {
        console.error('failed to write new short-track walk data file to:', newPath)
        console.error(e)
        process.exit(1)
      }
    })
  })
})

describe('Results table', async () => {
  it('Display the results of all the walks tested.', async () => {
    console.table(results)
    assert(true)
  })
})
