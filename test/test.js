import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
import {
  m2m,
  // calories,
  simpleCalories,
  pandolfCalories,
} from '../src/index.js'
import walk_1 from './walk_1.json' with { type: 'json' }
import walk_2 from './walk_2.json' with { type: 'json' }

console.log(walk_1.features[0].geometry.coordinates[0])
console.log(walk_2.features[0].geometry.coordinates[0])

const skip = { skip: true }
const weights = {
  body: 160 / 2.2, 
  ruck: 0,
  water: 0,
}

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
})
