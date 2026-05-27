/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary Calculate the distance between gps points.
 * @file: src/pointDistance.js
 */

/**
 * @summary Convert degrees into radians.
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @param {Number} degrees - Value in degrees to be converted.
 * @returm {Number} - Value in radians.
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

export function pointDistance(p1, p2, u = 'metric') {
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
