import {
  before,
  after,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'

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
