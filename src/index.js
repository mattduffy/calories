/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

/* eslint-disable camelcase */
let BODY_WEIGHT
let RUCK_WEIGHT
let COMBINED = BODY_WEIGHT + RUCK_WEIGHT

const SMOOTH_DEFAULT = true
const SMOOTH_DEFAULT_WINDOW = 5

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
 * @summary Check if x and y values are within 10% of each other.
 * @param {Number} x - The first input value.
 * @param {Number} y - The second input value, possibly within 10% of x.
 * @return {Boolean} - If y is within 10% of x, return True.
 */
function within10(x, y) {
  const _min = Math.min(x, y)
  const _max = Math.max(x, y)
  // If 90% of _max is less than the value of _min, return true.
  return (Math.floor(0.9 * _max) <= _min)
}

/**
 * @summary Check if x and y values are within 5% of each other.
 * @param {Number} x - The first input value.
 * @param {Number} y - The second input value, possibly within 5% of x.
 * @return {Boolean} - If y is within 5% of x, return True.
 */
function within5(x, y) {
  const _min = Math.min(x, y)
  const _max = Math.max(x, y)
  // If 95% of _max is less than the value of _min, return true.
  return (Math.floor(0.95 * _max) <= _min)
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
  const slope = verticalInterval / horizontalDistance
  const grade = slope * 100
  const angle = Math.atan(slope) * 180
  return {
    grade,
    angleDegrees: angle / Math.PI,
  }
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
function smoothAltitude(coords, windowSize = SMOOTH_DEFAULT_WINDOW) {
  const half = Math.floor(windowSize / 2)
  return coords.map((coord, i) => {
    const start = Math.max(0, i - half)
    const end = Math.min(coords.length - 1, i + half)
    const slice = coords.slice(start, end + 1)
    const validAlts = slice.map((c) => c[3]).filter((a) => a !== null)
    const avgerageAltitude = validAlts.length > 0
      ? validAlts.reduce((sum, a) => sum + a, 0) / validAlts.length
      : coord[3]
    // Return a new array with the smoothed altitude replaced
    return [coord[0], coord[1], coord[2], avgerageAltitude, coord[4], coord[5]]
  })
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
 * @summary Corrective factor for downhill (G < 0) segments of the hike.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {number} W - Body weight in kg.
 * @param {number} L - Load carried in kg (use 0 if none).
 * @param {number} V - Walking speed in m/s.
 * @param {number} G - Grade as a percentage (e.g. 10 for 10% incline, -5 for decline).
 * @param {number} n - Terrain coefficient (η).
 * @returns {number} Corrective factor in Watts.
 */
function santeeCorrective(W, L, V, G, n) {
  return n * (
    (G * (W + L) * V) / 3.5
      - ((W + L) * (((G + 6) ** 2) / W))
      + (25 * (V ** 2))
  )
}

/**
 * @summary Calculates metabolic rate (Watts) using the Pandolf-Santee equation.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} W - Body weight in kg.
 * @param {Number} L - Load carried in kg (use 0 if none).
 * @param {Number} V - Walking speed in m/s.
 * @param {Number} G - Grade as a percentage (e.g. 10 for 10% incline, -5 for decline).
 * @param {Number} n - Terrain coefficient (η).
 * @returns {Number} Metabolic rate in Watts (should always be >= 0).
 */
function pandolfMetabolicRate(W, L, V, G, n) {
  if (V <= 0) {
    return 0
  }
  const loadRatio = L / W
  const M = 1.5 * W
    + 2 * (W + L) * loadRatio ** 2
    + n * (W + L) * (1.5 * V ** 2 + 0.35 * V * G)
  let correction = 0
  if (G < 0) {
    correction = santeeCorrective(W, L, V, G, n)
    // console.log('santee corrective factor for downhill segments:', correction)
  }
  // The equation can return negative values on steep descents so clamp to 0.
  return Math.max(0, M - correction)
}

/**
 * @summary Processes a single segment (two consecutive GPS points) and returns metabolic and
 *          distance data for that segment.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[]} point1 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number[]} point2 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number} W - Body weight in kg.
 * @param {Number} L - Load carried in kg.
 * @param {Number} H2O - Water carried in kg.
 * @param {Number} n - Terrain coefficient.
 * @returns {Object|null} Segment result, or null if the segment should be skipped.
 */
function processPandolfSegment(point1, point2, W, L, H2O, n) {
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

  // Metabolic rate for this segment (Watts)
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
    metabolicRateWatts, // Watts
    kcal, // kilocalories
  }
}

/**
 * @summary Use the Pandolf-Santee model to calculate the total and per-segment
 *          calorie expenditure for a GPS track.
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
 *     segments : Number[] // Per-segment breakdown (see processPandolfSegment return shape)
 *   }
 */
function pandolfCalories(coords, options = {}) {
  const {
    bodyWeightKg,
    loadKg = 0,
    waterKg = 0,
    terrain = TERRAIN_COEFFICIENTS.DIRT,
    smooth = true,
    smoothWindow = SMOOTH_DEFAULT_WINDOW,
  } = options

  if (coords.length < 2) {
    throw new Error('At least 2 coordinate points are required.')
  }
  if (!bodyWeightKg || bodyWeightKg <= 0) {
    throw new Error('options.bodyWeightKg is required and must be a positive number.')
  }
  const track = (smooth) ? smoothAltitude(coords, smoothWindow) : coords
  const segments = []
  let totalKcal = 0
  let totalDistanceM = 0
  let totalDurationSec = 0

  for (let i = 1; i < track.length; i += 1) {
    const seg = processPandolfSegment(
      track[i - 1],
      track[i],
      bodyWeightKg,
      loadKg,
      waterKg,
      terrain,
    )
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
 * @see {@link pandolfCalories}
 * @see pandolfCalories
 */
function calculateCalories(coords, options = {}) {
  return pandolfCalories(coords, options)
}

/**
 * @todo Add function for calculating resting metabolic rate.
 * @summary Calculate the resting metabolic rate based on inputs provided.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} height - Body height, measured in cm.
 * @param {Number} weight - Body weight, measured in kg.
 * @param {Number} age - Age, in years.
 * @param {('m'|'f')} [sex='m'] - Male or female.
 * @return {Number} Resting metabolic rate in Watts per kg.
 */
function mResting(height, weight, age, sex) {
  const s = (sex === 'm') ? 5 : -161
  const kcals = (10 * weight) + (6.25 * height) - (5 * age) + s
  const joules = kcals * 4184
  const watts = joules / 86400
  return watts / weight
}

/**
 * @summary Calculate metabolic rate (W·kg⁻¹) using the LCDA predictive model.
 *          Implements equation 4 from Looney et al. (2022), which combines the
 *          level-walking LCDA backpacking equation (eq. 2) with the LCDA-graded
 *          walking equation (eq. 3) and terrain coefficient.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} L_Bp - Backpack load divided by body mass (dimensionless ratio,
 *                        e.g. 0.18 for a load equal to 18% of body mass).
 * @param {Number} S - Walking speed, in m/s.
 * @param {Number} G - Grade as decimal (rise/run, e.g. .05 for 5% incline, -.05 for decline).
 * @param {Number} n - Terrain coefficient (η).
 * @param {Object} rM - Values for calculating resting metabolic rate.
 * @param {Number} rM.height - Body height in cm.
 * @param {Number} rM.weight - Body weight in kg.
 * @param {Number} rM.age - Age, in years.
 * @param {('m'|'f')} rM.sex - Male or female.
 * @returns {Number} Body-mass-specific metabolic rate in W·kg⁻¹ (>= 0).
 */
function lcdaMetabolicRate(L_Bp, S, G, n, rM) {
  // Eq. 3 — LCDA-graded walking term (W·kg⁻¹); G is decimal grade (rise/run).
  function M_grade(s, g) {
    return 34 * s * g * (1 - 1.05 ** (1 - 1.1 ** (100 * g + 32)))
  }
  if (S <= 0) {
    return 0
  }
  const M_resting = mResting(rM.height, rM.weight, rM.age, rM.sex)
  const speedTerms = 1.78 * S ** 0.58 + 0.27 * S ** 4
  const gradeTerms = M_grade(S, G)
  const loadFactor = 1 + 1.96 * L_Bp ** 1.36

  // Eq. 4 — combined LCDA backpacking + graded + terrain equation (W·kg⁻¹)
  return Math.max(0, M_resting + (0.19 + n * (speedTerms + gradeTerms)) * loadFactor)
}

/**
 * @summary Process a single segment (two consecutive GPS points) and return metabolic and
 *          distance data for that segment.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[]} point1 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number[]} point2 - [longitude, latitude, heading, altitude, accuracy, timestamp]
 * @param {Number} W - Body weight in kg.
 * @param {Number} L - Load carried in kg (pack, excluding water).
 * @param {Number} H2O - Water carried in kg.
 * @param {Number} n - Terrain coefficient (η).
 * @param {Object} rM - Values for calculating resting metabolic rate.
 * @param {Number} rM.height - Body height in cm.
 * @param {Number} rM.weight - Body weight in kg.
 * @param {Number} rM.age - Age, in years.
 * @param {('m'|'f')} rM.sex - Male or female.
 * @returns {Object|null} Segment result, or null if the segment should be skipped.
 */
function processLcdaSegment(point1, point2, W, L, H2O, n, rM) {
  const [lon1, lat1, , alt1, , t1] = point1
  const [lon2, lat2, , alt2, , t2] = point2

  const p1 = { longitude: lon1, latitude: lat1, altitude: alt1 }
  const p2 = { longitude: lon2, latitude: lat2, altitude: alt2 }
  const horizontalDistance = pointDistance(p1, p2)
  const durationSec = (t2 - t1) / 1000 // seconds

  // Skip GPS jitter, stationary points, or out-of-order timestamps.
  if (durationSec <= 0 || horizontalDistance < MIN_SEGMENT_DIST_M) return null

  // Find the elevation change as slope between two points.
  const { grade } = calculateSlopeGrade(p1, p2)
  // Uses horizontal distance as the run (standard for hiking/trail grade).
  const altitudeDiff = alt2 - alt1

  // Derived speed - clamped to MAX_SPEED_MS to guard against GPS outliers.
  const speed = Math.min(horizontalDistance / durationSec, MAX_SPEED_MS)

  // LCDA equation uses L_Bp = load/body_mass (dimensionless).
  const L_Bp = (L + H2O) / W
  // LCDA equation uses grade as decimal (not %).
  const decimalGrade = grade / 100

  // lcdaMetabolicRate returns W·kg⁻¹; multiply by body mass to get total Watts.
  const metabolicRatePerKg = lcdaMetabolicRate(L_Bp, speed, decimalGrade, n, rM)
  const lcdaMetabolicRateWatts = metabolicRatePerKg * W

  // Energy expended = power × time (joules), converted to kcal.
  const kcal = (lcdaMetabolicRateWatts * durationSec) / JOULES_PER_KCAL

  return {
    horizontalDistance, // meters
    altitudeDiff, // meters
    grade, // percentage
    speed, // m/s
    durationSec, // seconds
    lcdaMetabolicRateWatts, // Watts
    kcal, // kilocalories
  }
}

/**
 * @summary Use the LCDA predictive model to estimate calories burned.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[][]} coords - GPS coordinate array.
 * @param {Object} BMR - Values for calculating resting metabolic rate.
 * @param {Number} BMR.height - Body height in cm.
 * @param {Number} BMR.weight - Body weight in kg.
 * @param {Number} BMR.age - Age, in years.
 * @param {('m'|'f')} BMR.sex - Male of female.
 * @param {Object} options
 * @param {Number} options.bodyWeightKg - Body weight in kg (required).
 * @param {Number} [options.loadKg=0] - Load/ruck weight in kg.
 * @param {Number} [options.waterKg=0] - Water weight carried in kg.
 * @param {Number} [options.terrain=1.1] - Terrain coefficient (n) Use TERRAIN_COEFFICIENTS.
 * @param {Boolean} [options.smooth=true] - Whether to smooth GPS altitude before calculating.
 * @param {Number} [options.smoothWindow=5] - Rolling average size for altitude smoothing.
 * @throws {Error} - Throws error if not enough coordinates.
 * @throws {Error} - Throws error if body weight is not provided.
 * @return {Object} Result object.
 */
function lcdaCalories(coords, BMR, options = {}) {
  const {
    bodyWeightKg,
    loadKg = 0,
    waterKg = 0,
    terrain = TERRAIN_COEFFICIENTS.DIRT,
    smooth = SMOOTH_DEFAULT,
    smoothWindow = SMOOTH_DEFAULT_WINDOW,
  } = options

  console.log('lcda parameters:')
  console.log(bodyWeightKg, loadKg, waterKg)
  console.log(terrain)
  console.log(smooth, smoothWindow)
  console.log('bmr', BMR)
  if (!coords || coords?.length < 2) {
    throw new Error('At least 2 coordinate points are required.')
  }
  if (!BMR || BMR.height <= 0 || BMR.weight <= 0 || BMR.age <= 0 || !/m|f/i.test(BMR.sex)) {
    const msg = 'BMR must include the following properties: \n'
      + '       height: positive number (cm)\n'
      + '       weight: positive number (kg)\n'
      + '          age: positive number (years)\n'
      + '          sex: string \'m|f\''
    throw new Error(msg)
  }
  if (!bodyWeightKg || bodyWeightKg <= 0) {
    throw new Error('options.bodyWeightKg is required and must be a positive number.')
  }
  const track = (smooth) ? smoothAltitude(coords, smoothWindow) : coords
  const segments = []
  let totalKcal = 0
  let totalDistanceM = 0
  let totalDurationSec = 0
  for (let i = 1; i < track.length; i += 1) {
    const seg = processLcdaSegment(
      track[i - 1],
      track[i],
      bodyWeightKg,
      loadKg || 0,
      waterKg || 0,
      terrain,
      BMR,
    )
    if (seg) {
      totalKcal += seg.kcal
      // console.log(`adding seg.kcal: ${seg.kcal} (${totalKcal})`)
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
    // segments,
  }
}

/**
 * @todo Create the calculation workflow for the minimum mechanics predictive model.
 * @summary Use the Minimum Mechanics Model to estimate calrories burned.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[][]} coords - GPS coordinate array.
 * @param
 * @throws
 * @return
 */
function minimumMechanicCalories() {
  // https://blog.smu.edu/research/2017/10/17/study-new-simple-method-determines-rate-burn-
  // calories-walking-uphill-downhill-level-ground/
  // https://pubmed.ncbi.nlm.nih.gov/28729390/
  // https://pmc.ncbi.nlm.nih.gov/articles/PMC8560389/
  // https://journals.physiology.org/doi/full/10.1152/japplphysiol.00504.2017
}

/**
 * @todo Create a function entrypoint that calculates the calorie estimate for each available
 *       predictive model, passing over the coords array just once, but processing each
 *       coordinate segment with each calorie model.
 * @summary Return an ensemble result of each of the available predicitive models, given a single
 *          array of coordinates.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[][]} coords - GPS coordinate array.
 * @param {Object} options
 * @param {Number} options.bodyWeightKg - Body weight in kg (required).
 * @param {Number} [options.loadKg=0] - Load/pack weight in kg.
 * @param {Number} [options.waterKg=0] - Water weight in kg carried.
 * @param {Number} [options.terrain=1.1]  - Terrain coefficient (n). Use TERRAIN_COEFFICIENTS.
 * @param {Number} [options.smoothWindow=5] - Rolling average size for altitude smoothing.
 * @param {Boolean} [options.smooth=true] - Whether to smooth GPS altitude before calculating.
 * @param {Object} [options.BMR] - Values for calculating resting metabolic rate.
 * @param {Number} [options.BMR.height] - BMR body height in cm.
 * @param {Number} [options.BMR.weight] - BMR body weight in kg.
 * @param {Number} [options.BMR.age] - BMR age, in years.
 * @param {('m'|'f')} [options.BMR.sex] - BMR sex Male of female.
 * @throws {Error} - Throws error if not enough coordinates.
 * @throws {Error} - Throws error if body weight is not provided.
 * @returns {Object} Result object:
 *   {
 *     totalPandolfKcal : Number, // Total pandolf calories burned
 *     totalLCDAKcal : Number, // Total LCDA calories burned
 *     totalDistanceM : Number, // Total horizontal distance (meters)
 *     totalDurationSec: Number, // Total elapsed time (seconds)
 *     avgSpeedMs : Number, // Average speed (m/s)
 *   }

 */
function calorieEnsemble(coords, options) {
  const {
    bodyWeightKg,
    loadKg = 0,
    waterKg = 0,
    terrain = TERRAIN_COEFFICIENT.DIRT,
    smooth = SMOOTH_DEFAULT,
    smoothWindow = SMOOTH_DEFAULT_WINDOW,
  } = options
  const BMR = options?.BMR ?? null
  console.log('emsemble parameters:')
  console.log(bodyWeightKg, loadKg, waterKg)
  console.log(terrain)
  console.log(smooth, smoothWindow)
  console.log('bmr', BMR)
  if (!coords || coords?.length <= 2) {
    throw new Error('At least 2 coordinate points are required.')
  }
  if (!BMR || BMR.height <= 0 || BMR.weight <= 0 || BMR.age <= 0 || !/m|f/i.test(BMR.sex)) {
    const msg = 'BMR must include the following properties: \n'
      + '       height: positive number (cm)\n'
      + '       weight: positive number (kg)\n'
      + '          age: positive number (years)\n'
      + '          sex: string \'m|f\''
    throw new Error(msg)
  }
  if (!bodyWeightKg || bodyWeightKg <= 0) {
    throw new Error('options.bodyWeightKg is required and must be a positive number.')
  }
  const track = (smooth) ? smoothAltitude(coords, smoothWindow) : coords
  const segments = []
  const results = {
    pandolf: { totalKcal: 0, totalDistanceM: 0, totalDurationSec: 0 },
    lcda: { totalKcal: 0, totalDistanceM: 0, totalDurationSec: 0 },
  }
  for (let i = 1; i < track.length; i += 1) {
    const pandolfSeg = processPandolfSegment(
      track[i - 1],
      track[i],
      bodyWeightKg,
      loadKg || 0,
      waterKg || 0,
      terrain,
    )
    if (pandolfSeg) {
      results.pandolf.totalKcal += pandolfSeg.kcal
      // console.log(`adding pandolfSeg.kcal: ${pandolfSeg.kcal} (${totalKcal})`)
      results.pandolf.totalDistanceM += pandolfSeg.horizontalDistance
      results.pandolf.totalDurationSec += pandolfSeg.durationSec
      // segments.push(pandolfSeg)
    }
    const lcdaSeg = processLcdaSegment(
      track[i - 1],
      track[i],
      bodyWeightKg,
      loadKg || 0,
      waterKg || 0,
      terrain,
      BMR,
    )
    if (lcdaSeg) {
      results.lcda.totalKcal += lcdaSeg.kcal
      // console.log(`adding lcdaSeg.kcal: ${lcdaSeg.kcal} (${totalKcal})`)
      results.lcda.totalDistanceM += lcdaSeg.horizontalDistance
      results.lcda.totalDurationSec += lcdaSeg.durationSec
      // segments.push(lcdaSeg)
    }
  }
  results.pandolf.avgSpeedMs = (results.pandolf.totalDurationSec > 0)
    ? results.pandolf.totalDistanceM / results.pandolf.totalDurationSec
    : 0
  results.lcda.avgSpeedMs = (results.lcda.totalDurationSec > 0)
    ? results.lcda.totalDistanceM / results.lcda.totalDurationSec
    : 0

  return results
}

export {
  m2m,
  degs,
  rads,
  within5,
  within10,
  lcdaCalories,
  simpleCalories,
  pandolfCalories,
  calorieEnsemble,
  calculateCalories,
  calculateSlopeGrade,
  minimumMechanicCalories,
}
