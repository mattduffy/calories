/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

import Debug from 'debug'
import { pointDistance } from './pointDistance.js'
import { calculateSlopeGrade } from './slope.js'

// const error = Debug('calories:ERROR')
const log = Debug('calories')
log.log = console.log.bind(console)

let BODY_WEIGHT
let RUCK_WEIGHT
let COMBINED = BODY_WEIGHT + RUCK_WEIGHT

const TERRAIN_COEFFICIENTS = {
  BLACKTOP: 1.0, // Paved road / treadmill
  DIRT: 1.1, // Dirt path / packed trail
  LIGHT: 1.2, // Light off-trail, grass
  SOFT: 1.5, // Soft sand, deep grass, loose gravel
  HEAVY: 1.8, // Snow, heavy brush, swamp
}

/**
 * Maximum plausible walking speed (m/s). Segments faster than this are clamped.
 */
const MAX_SPEED_MS = 4.0

/**
 * Minimum segment distance (m) to process. Filters out GPS jitter.
 */
const MIN_SEGMENT_DIST_M = 0.5

/**
 * Conversion: 1 kcal = 4184 joules
 */
const JOULES_PER_KCAL = 4184

/**
 * @summary Convert a number of milliseconds to minutes.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} milliseconds - The number of milliseconds to convert to minutes.
 * @return {Number} - The calculated number of minutes.
 */
function m2m(milliseconds) {
  return milliseconds / 60000
}

/**
 * @summary The simplest calorie estimating function.  No account is given for
 * terrain type, gps factors (hill grading), uphill vs downhill efforts, etc.
 * MET - ratio of energy spent per unit time during a specific physical activity to a
 * reference value of 3.5 ml O₂/(kg·min).
 * Metabolic Equivalent Task (Hiking):
 *  MET = 7.5 (7.0 for backpacking or general weight lifting has a MET of 3.5)
 *  Calories Burned Per Minute: Calories / minute = (MET * 3.5 * Weight in kg) / 200
 *  Ttl Calories Burned: Total Caloires Burned = (MET * 3.5 * Weight in kg) / 200 * minutes
 * How to use:
 * Weight: Your body weight plus the weight of your ruck/pack.
 * Convert to kg if needed (1 lb≈0.4536 kg).
 * Duration: The total time spent hiking/rucking, in minutes.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} [minutes=1] - Time spent expending energy, in minutes.
 * @param {object} weights - The different weight values to be combined.
 * @param {Number} [weights.body=0] - Body weight in kilograms.
 * @param {Number} [weights.ruck=0] - Ruck weight carried, in kilograms.
 * @param {Number} [weights.water=0] - Weight of water carried, in kilograms.
 * @param {Number} [MET=7.5] - The metabolic equivalent task number.
 * @return {Number} - Estimated calories used per duration of MET.
 */
function simpleCalories(minutes = 1, weights = { body: 0, ruck: 0, water: 0 }, MET = 7.5) {
  log('calculating simple EE method')
  log('minutes', minutes)
  log('weights', weights)
  COMBINED = weights.body + weights.ruck + weights.water
  log('combined weights', COMBINED)
  log(`computing ((${MET} * 3.5 * ${COMBINED}) / 200) * ${minutes}`)
  return ((MET * 3.5 * COMBINED) / 200) * minutes
}

/**
 * @summary Calculates metabolic rate (watts) using the Pandolf-Santee equation.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {number} W - Body weight in kg
 * @param {number} L - Load carried in kg (use 0 if none)
 * @param {number} V - Walking speed in m/s
 * @param {number} G - Grade as a percentage (e.g. 10 for 10% incline, -5 for decline)
 * @param {number} n - Terrain coefficient (η)
 * @returns {number} Metabolic rate in watts (always >= 0)
 */
function pandolfMetabolicRate(W, L, V, G, n) {
  if (V <= 0) return 0

  const loadRatio = L / W
  const M = 1.5 * W
    + 2 * (W + L) * loadRatio ** 2
    + n * (W + L) * (1.5 * V ** 2 + 0.35 * V * G)

  // The equation can return negative values on steep descents; clamp to 0
  return Math.max(0, M)
}

/**
 * @summary Applies a simple rolling-average smoother to the altitude values in a
 * coordinate array. Raw GPS altitude can have ±5–15 m of noise, which creates
 * artificial grade spikes that inflate calorie estimates.
 *
 * Returns a new array — the original is not mutated.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Numver[][]} coords - Array of coordinate arrays
 * @param {number} [windowSize=5] - Number of points to average (odd number recommended)
 * @returns {Number[][]} New coordinate array with smoothed altitudes
 */
function smoothAltitude(coords, windowSize = 5) {
  const half = Math.floor(windowSize / 2)

  return coords.map((coord, i) => {
    const start = Math.max(0, i - half)
    const end = Math.min(coords.length - 1, i + half)
    const slice = coords.slice(start, end + 1)
    const avgAlt = slice.reduce((sum, c) => sum + c[3], 0) / slice.length

    // Return a new array with the smoothed altitude (index 3) replaced
    return [coord[0], coord[1], coord[2], avgAlt, coord[4], coord[5]]
  })
}

/**
 * @summary The Pandolf equation for estimating energy expenditure.
 * This equation is more complex and includes factors like speed and terrain grade.
 * M = 1.5W + 2.0 * (W + L) * (L / W) + n * (W + L) * (1.5V + 0.35VG)
 * Where:
 * M = Metabolic rate (calories per minute)
 * W = Body weight
 * L = Load carried (weight of the ruck)
 * V = Speed
 * G = Grade of incline (e.g., 0 for flat, 1 for 100%)
 * n = Terrain factor (e.g., 1.0 for pavement, or higher for sand/brush)
 * @author Matthew Duffy <mattuffy@gmail.com>
 * @param {Number} W - The body weight.
 * @param {Number} L - The weight of the load carried.
 * @param {Number} V - The speed of the hike.
 * @param {Number} G - The grade of incline climbed (0 for flat, 1 for 100%).
 * @param {Number} [n=1.2] - The terrain factor (1.0 for pavement, higher for sand/brush).
 * @return
 */
// function _pandolfCalories(W, L, V, G, n = 1.2) {
//   log('calculating Pandolf equation for calories used.')
//   // 1.5W + 2.0(W + L)(L/W) + n(W + L)(1.5V + 0.35VG)
//   return (1.5 * W) + (2.0 * (W + L)) * (L / W) + ((n * (W + L)) * ((1.5 * V) + (0.35 * V) * G))
// }

/**
 * Processes a single segment (two consecutive GPS points) and returns
 * metabolic and distance data for that segment.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[]} point1 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number[]} point2 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number} W - Body weight (kg)
 * @param {Number} L - Load carried (kg)
 * @param {Number} n - Terrain coefficient
 * @returns {Object|null} - Segment result, or null if the segment should be skipped
 */
function processSegment(point1, point2, W, L, n) {
  const [lon1, lat1, , alt1, , t1] = point1
  const [lon2, lat2, , alt2, , t2] = point2

  const p1 = { longitude: lon1, latitude: lat1 }
  const p2 = { longitude: lon2, latitude: lat2 }
  const horizontalDist = pointDistance(p1, p2)
  const timeDiff = (t2 - t1) / 1000 // seconds

  // Skip GPS jitter, stationary points, or out-of-order timestamps
  if (timeDiff <= 0 || horizontalDist < MIN_SEGMENT_DIST_M) return null

  const altitudeDiff = alt2 - alt1

  // Grade as a percentage: rise / run * 100
  // Uses horizontal distance as the "run" (standard for hiking/trail grade)
  const grade = (altitudeDiff / horizontalDist) * 100

  // Derived speed; clamped to MAX_SPEED_MS to guard against GPS outliers
  const speed = Math.min(horizontalDist / timeDiff, MAX_SPEED_MS)

  // Metabolic rate for this segment (watts)
  const metabolicRateW = pandolfMetabolicRate(W, L, speed, grade, n)

  // Energy expended = power × time (joules), converted to kcal
  const kcal = (metabolicRateW * timeDiff) / JOULES_PER_KCAL

  return {
    horizontalDist, // meters
    altitudeDiff, // meters
    grade, // percent
    speed, // m/s
    durationSec: timeDiff, // seconds
    metabolicRateW, // watts
    kcal, // kilocalories
  }
}

/**
 * @summary Calculates total and per-segment calorie expenditure for a GPS track.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[][]} coords - GPS coordinate array. Each element:
 *                              [
 *                                longitude,
 *                                latitude,
 *                                heading,
 *                                altitude (m),
 *                                accuracy (m),
 *                                timestamp (ms),
 *                              ]
 * @param {Object} options
 * @param {Number} options.weightKg       - Body weight in kg (required)
 * @param {Number} [options.loadKg=0]     - Load/pack weight in kg
 * @param {Number} [options.terrain=1.0]  - Terrain coefficient (η). Use TERRAIN_COEFFICIENTS.
 * @param {Boolean} [options.smooth=true] - Whether to smooth GPS altitude before calculating.
 * @param {Number} [options.smoothWindow=5] - Rolling average size for altitude smoothing.
 * @returns {Object} Result object:
 *   {
 *     totalKcal : Number, // Total calories burned
 *     totalDistanceM : Number, // Total horizontal distance (meters)
 *     totalDurationSec: Number, // Total elapsed time (seconds)
 *     avgSpeedMs : Number, // Average speed (m/s)
 *     segments : Number[] // Per-segment breakdown (see processSegment return shape)
 *   }
 */
function calculateCalories(coords, options = {}) {
  const {
    weightKg,
    loadKg = 0,
    terrain = TERRAIN_COEFFICIENTS.BLACKTOP,
    smooth = true,
    smoothWindow = 5,
  } = options

  if (!weightKg || weightKg <= 0) {
    throw new Error('weightKg is required and must be a positive number.')
  }
  if (coords.length < 2) {
    throw new Error('At least 2 coordinate points are required.')
  }
  const track = smooth ? smoothAltitude(coords, smoothWindow) : coords
  const segments = []
  let totalKcal = 0
  let totalDistanceM = 0
  let totalDurationSec = 0

  for (let i = 1; i < track.length; i += 1) {
    const seg = processSegment(track[i - 1], track[i], weightKg, loadKg, terrain)
    // if (!seg) continue
    if (seg) {
      totalKcal += seg.kcal
      totalDistanceM += seg.horizontalDist
      totalDurationSec += seg.durationSec
      segments.push(seg)
    }
  }

  const avgSpeedMs = totalDurationSec > 0 ? totalDistanceM / totalDurationSec : 0

  return {
    totalKcal,
    totalDistanceM,
    totalDurationSec,
    avgSpeedMs,
    segments,
  }
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

const slope = calculateSlopeGrade(gpsPointA, gpsPointB)
log(`Slope Percentage: ${slope.percentage.toFixed(2)}%`)
log(`Slope Angle: ${slope.angleDegrees.toFixed(2)} degrees`)

export {
  m2m,
  // calories,
  simpleCalories,
  calculateCalories as pandolfCalories,
}
