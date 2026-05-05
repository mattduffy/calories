import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
import {
  calories,
  simpleCalories,
  pandolfCalories,
} from '../src/index.js'
import walk_1 from './walk_1.json' with { type: 'json' }
import walk_2 from './walk_2.json' with { type: 'json' }

console.log(walk_1.features[0].geometry.coordinates[0])
console.log(walk_2.features[0].geometry.coordinates[0])

const skip = { skip: true }

describe('First test suite for calories package', async () => {
  before(() => {
    console.log('running before each test')
  })
  after(() => {
    console.log('running after each test')
  })

  it('First calorie test', async () => {
    console.log('testing first test.')
    assert(true)
  })
})
