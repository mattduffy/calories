/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary Calculate the slope/grade/incline between two points.
 * @file: src/slope.js
 */

import { pointDistance } from './pointDistance.js'

/*
 * Convert degrees to radians.
 * @param {Number} degrees - Degrees to be converted to radians.
 * @return {Number} - Number of radians.
 */
export function rads(degrees) {
  return degrees * (Math.PI / 180)
}

/*
 * Convert radians to degrees.
 * @param {Number} radians - Radians to be converted to degrees.
 * @return {Number} deg - Number of degrees.
 */
export function degs(radians) {
  const deg = radians * (180 / Math.PI)
  console.log(`radians in ${radians} \ndegrees out ${deg}`)
  return deg
}

/*
 * Calculate difference in altitude between two points.
 * @param {Number} alt1 - First altitude value, in meters.
 * @param {Number} alt1 - Second altitude value, in meters.
 * return {Number} - Difference in altitude.
 */
export function calculateVerticalInterval(alt1, alt2) {
  // Vertical difference in meters
  return Math.abs(alt2 - alt1)
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
export function calculateSlopeGrade(point1, point2) {
  const horizontalDistance = pointDistance(
    { latitude: point1.latitude, longitude: point1.longitude },
    { latitude: point2.latitude, longitude: point2.longitude },
  )

  const verticalInterval = calculateVerticalInterval(point1.altitude, point2.altitude)

  if (horizontalDistance === 0) {
    // Vertical ascent/descent
    return { percentage: Infinity, angleDegrees: 90 }
  }

  const slopePercentage = (verticalInterval / horizontalDistance) * 100
  const slopeAngleRadians = Math.atan(verticalInterval / horizontalDistance)
  const slopeAngleDegrees = (slopeAngleRadians * 180) / Math.PI

  return {
    percentage: slopePercentage,
    angleDegrees: slopeAngleDegrees,
  }
}
