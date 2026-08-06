import { pointDistance } from '../src/index.js'
import walk_35 from './walk_35-you-can-get-multiple-things.json' with { type: 'json' }

const coords = walk_35.features[0].geometry.coordinates

let wacky
let max = 0
let newMax = 0
coords.map((c, i) => {
  // console.log(i)
  const curr = coords[i]
  const next = coords[i + 1]
  if (i > 1 && i + 1 < coords.length) {
    const p1 = { longitude: curr[0], latitude: curr[1] }
    const p2 = { longitude: next[0], latitude: next[1] }
    // console.log(p1, p2)
    const d = pointDistance(p1, p2)
    newMax = Math.max(max, d)
    if (newMax > max) {
      console.log(`new max point distance: ${newMax}`)
      max = newMax
    }
    if (d > 12.5) {
      console.log(`index ${i} and ${i + 1}`)
      console.log(c)
      console.log('p1 ', p1)
      console.log('p2 ', p2)
      console.log(`point distance: ${d}`)
    }
  }
})
console.log(`max point distance is ${max}`)
// [-122.23285675000001, 37.78451156, 0, null, 10.40676430921577, 1785964802756]
 
 
 
 
 
 

