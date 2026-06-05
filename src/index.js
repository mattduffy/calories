/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

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
 * @summary Check if y is within 10% of x: y = 91, x = 100 => true.
 * @param {Number} x - The comparator input value.
 * @param {Number} y - The input value, as some percentage of x.
 * @return {Boolean} - If y is within 10% of x, return True.
 */
function within10(x, y) {
  return (0.9 * x) <= y
}

/**
 * @summary Check if y is within 5% of x: y = 94, x = 100 => true.
 * @param {Number} x - The comparator input value.
 * @param {Number} y - The input value, as some percentage of x.
 * @return {Boolean} - If y is within 5% of x, return True.
 */
function within5(x, y) {
  // this is not mathematically correct, and should maybe do a sanity check first
  // to make sure y is not already bigger than x.
  return (0.95 * x) <= y
}

/**
 * @summary Convert degrees into radians.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} degrees - Value in degrees to be converted.
 * @returm {Number} - Value in radians.
 */
function rads(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * @summary Convert radians into degrees.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} degrees - Value in radians to be converted.
 * @returm {Number} - Value in degrees.
 */
function degs(radians) {
  const deg = radians * (180 / Math.PI)
  console.log(`radians in ${radians} \ndegrees out ${deg}`)
  return deg
}

/**
 * @summary Calculate the distance between 2 gps coordinate points using a haversine function.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {} p1 - First gps coordinate point.
 * @param {} p2 - Second gps coordinate point.
 * @param {String} u - Unit of measurement to use.
 * @return {Number} - The arc distance between to gps points.
 */
function pointDistance(p1, p2, u = 'metric') {
  // console.log('calories::pointDistances(p1, p2, u): ', p1, p2, u)
  const earthRadiusKm = 6371
  const earthRadiusMeters = 6371000
  const earthRadiusMi = 3959
  const _u = u.toLowerCase()
  let r
  if (_u === 'metric' || _u === 'meters') {
    r = earthRadiusMeters
  } else if (_u === 'km') {
    r = earthRadiusKm
  } else if (_u === 'miles' || _u === 'mi' || _u === 'imperial') {
    r = earthRadiusMi
  } else {
    r = earthRadiusMeters
    console.log('No units given, default to earth radius in meters')
  }
  // console.log(`calories::pointDistance() using earth radius: ${r} ${_u}`)
  const dLat = rads(p2.latitude - p1.latitude)
  const dLon = rads(p2.longitude - p1.longitude)
  const lat1 = rads(p1.latitude)
  const lat2 = rads(p2.latitude)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return r * c
}

/*
 * Calculate difference in altitude between two points.
 * @param {Number} alt1 - First altitude value, in meters.
 * @param {Number} alt1 - Second altitude value, in meters.
 * @return {Number} - Difference in altitude.
 */
function calculateVerticalInterval(alt1, alt2) {
  // Vertical difference in meters
  // return Math.abs(alt2 - alt1)
  return alt2 - alt1
}

/*
 * Calculate the slope between two gps points.
 * @param {Object} point1 - A gps coordinate point.
 * @param {Number} point1.longitude - A gps longitude coordinate.
 * @param {Number} point1.latitude - A gps latitude coordinate.
 * @param {Object} point2 - A gps coordinate point.
 * @param {Number} point2.longitude - A gps longitude coordinate.
 * @param {Number} point2.latitude - A gps latitude coordinate.
 * @return {Object} - Object containing slope in percentage and degree values.
 */
function calculateSlopeGrade(point1, point2) {
  // slope = Rise / Run           Ration or Fraction
  // grade = (Rise / Run) * 100   Percentage
  // angle = arctan(Rise / Run)   Degress
  const horizontalDistance = pointDistance(
    { latitude: point1.latitude, longitude: point1.longitude },
    { latitude: point2.latitude, longitude: point2.longitude },
  )
  const verticalInterval = calculateVerticalInterval(point1.altitude, point2.altitude)
  if (horizontalDistance === 0) {
    // Vertical ascent/descent
    return { grade: Infinity, angleDegrees: 90 }
  }
  // const slopePercentage =
  // const slopeAngleRadians =
  // const slopeAngleDegrees = (slopeAngleRadians * 180) / Math.PI
  return {
    grade: (verticalInterval / horizontalDistance) * 100,
    angleDegrees: (Math.atan(verticalInterval / horizontalDistance) * 180) / Math.PI,
  }
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
 * @param {Object} weights - The different weight values to be combined.
 * @param {Number} [weights.body=0] - Body weight in kilograms.
 * @param {Number} [weights.ruck=0] - Ruck weight carried, in kilograms.
 * @param {Number} [weights.water=0] - Weight of water carried, in kilograms.
 * @param {Number} [MET=7.5] - The metabolic equivalent task number.
 * @throws {Error} - If minutes is not a number greater than zero.
 * @throws {Error} - If weights.body is not a number greater than zero.
 * @return {Number} - Estimated calories used per duration of MET.
 */
function simpleCalories(minutes = 1, weights = { body: 0, ruck: 0, water: 0 }, MET = 7.5) {
  if (minutes <= 0 || !Number.isFinite(minutes) || minutes === null) {
    throw new Error('minutes parameter must be a number greater than zero.')
  }
  if (weights.body <= 0
    || !Number.isFinite(weights.body)
    || weights.body === null
    || weights.body === undefined) {
    throw new Error('weights.body must be a number greater than zero.')
  }
  if (MET <= 0 || !Number.isFinite(MET) || MET === null || MET === undefined) {
    throw new Error('MET parameter must be a number greater than zero.')
  }
  console.log('calculating simple EE method')
  console.log('minutes', minutes)
  console.log('weights', weights)
  COMBINED = weights.body + weights.ruck + weights.water
  console.log('combined weights', COMBINED)
  console.log(`computing ((${MET} * 3.5 * ${COMBINED}) / 200) * ${minutes}`)
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
  if (V <= 0) {
    return 0
  }
  const loadRatio = L / W
  const M = 1.5 * W + 2
    * (W + L) * loadRatio ** 2 + n
    * (W + L) * (1.5 * V ** 2 + 0.35 * V * G)
  // The equation can return negative values on steep descents so clamp to 0.
  return Math.max(0, M)
}

/**
 * @summary Applies a simple rolling-average smoother to the altitude values in a
 * coordinate array. Raw GPS altitude can have ±5–15 m of noise, which creates
 * artificial grade spikes that inflate calorie estimates.
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
    const avgerageAltitude = slice.reduce((sum, c) => sum + c[3], 0) / slice.length
    // Return a new array with the smoothed altitude replaced
    return [coord[0], coord[1], coord[2], avgerageAltitude, coord[4], coord[5]]
  })
}

/**
 * @summary Processes a single segment (two consecutive GPS points) and returns metabolic and
 * distance data for that segment.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[]} point1 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number[]} point2 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number} W - Body weight in kg.
 * @param {Number} L - Load carried in kg.
 * @param {Number} H2O - Water carried in kg.
 * @param {Number} n - Terrain coefficient
 * @returns {Object|null} - Segment result, or null if the segment should be skipped.
 */
function processSegment(point1, point2, W, L, H2O, n) {
  const [lon1, lat1, , alt1, , t1] = point1
  const [lon2, lat2, , alt2, , t2] = point2

  const p1 = { longitude: lon1, latitude: lat1, altitude: alt1 }
  const p2 = { longitude: lon2, latitude: lat2, altitude: alt2 }
  const horizontalDistance = pointDistance(p1, p2)
  const durationSec = (t2 - t1) / 1000 // seconds

  // Skip GPS jitter, stationary points, or out-of-order timestamps.
  if (durationSec <= 0 || horizontalDistance < MIN_SEGMENT_DIST_M) return null

  // Find the elevation change as slope between two points.
  const slopeGrade = calculateSlopeGrade(p1, p2)
  const { grade } = slopeGrade
  // Uses horizontal distance as the "run" (standard for hiking/trail grade).
  const altitudeDiff = alt2 - alt1

  // Derived speed - clamped to MAX_SPEED_MS to guard against GPS outliers.
  const speed = Math.min(horizontalDistance / durationSec, MAX_SPEED_MS)

  // Metabolic rate for this segment (watts)
  const combinedL = L + H2O
  const metabolicRateWatts = pandolfMetabolicRate(W, combinedL, speed, grade, n)

  // Energy expended = power × time (joules), converted to kcal.
  const kcal = (metabolicRateWatts * durationSec) / JOULES_PER_KCAL

  return {
    horizontalDistance, // meters
    altitudeDiff, // meters
    grade, // percentage
    speed, // m/s
    durationSec, // seconds
    metabolicRateWatts, // watts
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
 * @param {Number} options.bodyWeightKg - Body weight in kg (required).
 * @param {Number} [options.loadKg=0] - Load/pack weight in kg.
 * @param {Number} [options.waterKg=0] - Water weight in kg carried.
 * @param {Number} [options.terrain=1.1]  - Terrain coefficient (n). Use TERRAIN_COEFFICIENTS.
 * @param {Boolean} [options.smooth=true] - Whether to smooth GPS altitude before calculating.
 * @param {Number} [options.smoothWindow=5] - Rolling average size for altitude smoothing.
 * @throws {Error} - Throws error if not enough coordinates.
 * @throws {Error} - Throws error if body weight is not provided.
 * @returns {Object} Result object:
 *   {
 *     totalKcal : Number, // Total calories burned
 *     totalDistanceM : Number, // Total horizontal distance (meters)
 *     totalDurationSec: Number, // Total elapsed time (seconds)
 *     avgSpeedMs : Number, // Average speed (m/s)
 *     segments : Number[] // Per-segment breakdown (see processSegment return shape)
 *   }
 */
function pandolfCalories(coords, options = {}) {
  const {
    bodyWeightKg,
    loadKg = 0,
    waterKg = 0,
    terrain = TERRAIN_COEFFICIENTS.DIRT,
    smooth = true,
    smoothWindow = 5,
  } = options

  if (coords.length < 2) {
    throw new Error('At least 2 coordinate points are required.')
  }
  if (!bodyWeightKg || bodyWeightKg <= 0) {
    throw new Error('weightKg is required and must be a positive number.')
  }
  const track = (smooth) ? smoothAltitude(coords, smoothWindow) : coords
  const segments = []
  let totalKcal = 0
  let totalDistanceM = 0
  let totalDurationSec = 0

  for (let i = 1; i < track.length; i += 1) {
    const seg = processSegment(track[i - 1], track[i], bodyWeightKg, loadKg, waterKg, terrain)
    if (seg) {
      totalKcal += seg.kcal
      totalDistanceM += seg.horizontalDistance
      totalDurationSec += seg.durationSec
      segments.push(seg)
    }
  }
  const avgSpeedMs = (totalDurationSec > 0) ? totalDistanceM / totalDurationSec : 0
  return {
    totalKcal,
    totalDistanceM,
    totalDurationSec,
    avgSpeedMs,
    segments,
  }
}

/**
 * @summary A wrapper function to preserver the function name calculateCalories() after
 *          it was renamed pandolfCalories(), to make room for additional advanced calorie
 *          estimating models.
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
 * @param {Object} - options
 * @param {Number} options.bodyWeightKg - Body weight in kg (required).
 * @param {Number} [options.loadKg=0] - Load/pack weight in kg.
 * @param {Number} [options.waterKg=0] - Water weight in kg carried.
 * @param {Number} [options.terrain=1.1]  - Terrain coefficient (n). Use TERRAIN_COEFFICIENTS.
 * @param {Boolean} [options.smooth=true] - Whether to smooth GPS altitude before calculating.
 * @param {Number} [options.smoothWindow=5] - Rolling average size for altitude smoothing.
 * @throws {Error} - Throws error if not enough coordinates.
 * @throws {Error} - Throws error if body weight is not provided.
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
  return pandolfCalories(coords, options)
}

function minimumMechanicCalories() {
  // https://blog.smu.edu/research/2017/10/17/study-new-simple-method-determines-rate-burn-
  // calories-walking-uphill-downhill-level-ground/
  // https://pubmed.ncbi.nlm.nih.gov/28729390/
  // https://pmc.ncbi.nlm.nih.gov/articles/PMC8560389/
  // https://journals.physiology.org/doi/full/10.1152/japplphysiol.00504.2017
}

export {
  m2m,
  degs,
  rads,
  within5,
  within10,
  simpleCalories,
  pandolfCalories,
  calculateCalories,
  calculateSlopeGrade,
  minimumMechanicCalories,
}
