/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

import { pointDistance } from './pointDistance.js'
import Debug from 'debug'

Debug.log = console.log.bind(console)
const log = Debug('calories')
const error = log.extend('ERROR')

console.log(pointDistance)

export function simpleCalories() {
  console.log('simple calories')
}
