/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary The calories package entry point.
 * @file src/index.js
 */

import Debug from 'debug'
import { pointDistance } from './pointDistance.js'
import { calculateSlopeGrade } from './slope.js'

const error = Debug('calories:ERROR')
const log = Debug('calories')
log.log = console.log.bind(console)

log(pointDistance)
error(pointDistance)

let BODY_WEIGHT
let RUCK_WEIGHT
const COMBINED = BODY_WEIGHT + RUCK_WEIGHT

// bump
// second bump
// third bump

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
 * @param {Number} MET - The metabolic equivalent task number.
 * @param {Number} minutes - Time spent expending energy, in minutes.
 * @return {Number} - Estimated calories used per duration of MET.
 */
function simpleCalories(MET = 7.5, minutes = 1) {
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
 * @param {Number} W - The body weight.
 * @param {Number} L - The load/weight carried.
 * @param {Number} V - The speed of the hike.
 * @param {Number} G - The grade of incline climbed (0 for flat, 1 for 100%).
 * @param {Number} n - The terrain factor (1.0 for pavement, higher for sand/brush).
 * @return
 */
function pandolf(W, L, V, G, n = 1.2) {
  log('calculating Pandolf equation for calories used.')
  // 1.5W + 2.0(W + L)(L/W) + n(W + L)(1.5V + 0.35VG)
  return (1.5 * W) + (2.0 * (W + L)) * (L / W) + ((n * (W + L)) * ((1.5 * V) + (0.35 * V) * G))
}

/*
 * @summary From a geojson data structure, extract the timestamps and
 * GPS waypoints to calculate calories burned.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Object} GeoJson - A geojson object with location data and a properties member.
 * @param {Array} GeoJson.properties.timestamps - An array of timestamps associated with each
 * GPS waypoint.
 * @param {Number} bodyWeight - The body weight.
 * @param {Number} [ruckWeight=null] - Optional ruck weight to include.
 * @return {Number} - Estimated calories burned.
 */
function caloriesFromGeojson(GeoJson, bodyWeight, ruckWeight = null) {
  log('caloriesFromGeojson:', ruckWeight)
}

/*
 * @summary Calculate calories burned from provided GPS waypoints, timestamps, body weight and
 * optional ruck weight if provided.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number[]} timesstamps - An array of timestamps.
 * @param {Object[]} waypoints - An array of objects containing gps waypoints.
 * @param {Number} bodyWeight - The body weight.
 * @param {Number} [ruckWeight=null] - Optional ruck weight to include.
 * @return {Number} - Estimated calories burned
 */
function calories(timestamps, waypoints, bodyWeight, ruckWeight = null) {
  log('calories:', ruckWeight)
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
  calories,
  simpleCalories,
  caloriesFromGeojson,
  pandolf,
}
