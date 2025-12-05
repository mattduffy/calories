/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

import Debug from 'debug'
import { pointDistance } from './pointDistance.js'

const error = Debug('calories:ERROR')
const log = Debug('calories')
log.log = console.log.bind(console)

log(pointDistance)
error(pointDistance)

let BODY_WEIGHT
let RUCK_WEIGHT
const COMBINED = BODY_WEIGHT + RUCK_WEIGHT

/**
 * @summary The simplest calorie estimating function.  No account is given for
 * terrain type, gps factors (hill grading), uphill vs downhill efforts, etc.
 * MET - ratio of energy spent per unit time during a specific physical activity to a
 * reference value of 3.5 ml O₂/(kg·min).
 * Metabolic Equivalent Task (Hiking):
 *  MET = 7.5 (7.0 for backpacking or general weight lifting has a MET of 3.5)
 *  Calories Burned Per Minute: 𝐶𝑎𝑙𝑜𝑟𝑖𝑒𝑠/𝑚𝑖𝑛 = (MET * 3.5 * Weight in kg) / 200
 *  Ttl Calories Burned: 𝑇𝑜𝑡𝑎𝑙𝐶𝑎𝑙𝑜𝑟𝑖𝑒𝑠𝐵𝑢𝑟𝑛𝑒𝑑 = (MET * 3.5 * Weight in kg) / 200 * minutes
 * How to use:
 * Weight: Your body weight plus the weight of your ruck/pack.
 * Convert to kg if needed (1 lb≈0.4536 kg).
 * Duration: The total time spent hiking/rucking, in minutes.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param Number minutes - Time spent expending energy, in minutes.
 * @param Number MET - The metabolic equivalent task number.
 * @return Number - Estimated calories used per duration of MET.
 */
function simpleCalories(minutes, MET = 7.5) {
  log('calculating simple EE method')
  return ((MET * 3.5 * COMBINED) / 200) * minutes
}

/**
 * @summary The Pandolf equation for estimating energy expenditure.
 * This equation is more complex but includes factors like terrain grade.
 * M = 1.5W + 2.0 * (W + L) * (L / W) + n * (W + L) * (1.5V + 0.35VG)
 * Where:
 * M = Metabolic rate (calories per minute)
 * W = Body weight
 * L = Load carried (weight of the ruck)
 * V = Speed
 * G = Grade of incline (e.g., 0 for flat, 1 for 100%)
 * n = Terrain factor (e.g., 1.0 for pavement, or higher for sand/brush)
 * @author Matthew Duffy <mattuffy@gmail.com>
 * @param Number W - The body weight.
 * @param Number L - The load/weight carried.
 * @param Number V - The speed of the hike.
 * @param Number G - The grade of incline climbed (0 for flat, 1 for 100%).
 * @param Number n - The terrain factor (1.0 for pavement, higher for sand/brush).
 * @return
 */
function pandolf(W, L, V, G, n = 1.2) {
  log('calculating Pandolf equation for calories used.')
  // 1.5W + 2.0(W + L)(L/W) + n(W + L)(1.5V + 0.35VG)
  return (1.5 * W) + (2.0 * (W + L)) * (L / W) + ((n * (W + L)) * ((1.5 * V) + (0.35 * V) * G))
}

export {
  simpleCalories,
  pandolf,
}
