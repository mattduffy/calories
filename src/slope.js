/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary Calculate the slope/grade/incline between two points.
 * @file: src/slope.js
 */

import { pointDistance } from './pointDistance.js'
/*
 * Google: how to calculate the grade of a slope between two gps coordinates in javascript
 */
export function rads(degrees) {
  return degrees * (Math.PI / 180)
}

export function degs(radians) {
  const deg = radians * (180 / Math.PI)
  console.log(`radians in ${radians} \ndegrees out ${deg}`)
  return deg
}

export function calculateVerticalInterval(alt1, alt2) {
  // Vertical difference in meters
  return Math.abs(alt2 - alt1)
}

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
