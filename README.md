# Estimating Energy Expenditure Using The Pandolf-Santee Equation

Creating accurate estimates of the number of calories burned during a physical activity period is notoriously difficult, especially when attempting to incorporate positional data.  Most instances of estimating calories burned are simply calculated as an exertion effort based on body weight, time duration and a known __MET__ ([Metabolic Equivalent Task](https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task)) value for a given activity.  This method doesn't include positional data such as distance, velocity or elevation changes.  This can be considered a simple calorie estimate.

There are several, more advanced methods for estimating calories burned that do attempt to incorporate GPS data for a richer, more nuanced estimate.  The Pandolf-Santee equation is one such approach and is the one used in this package.

This package provides functions for both simple calorie estimates, and a more advanced method based on the Pandolf-Santee formula.

## Using 

```bash
npm install --save @mattduffy/calories
```

```javascript
import { simpleCalories, pandolfCalories } from '@mattduffy/calories'
```

## Simple Calories
The simple calories calculation takes 3 parameters: ``minutes``, ``weights``, and ``MET``, and returns a positive floating point value.  The function throws an ``Error`` if the required parameters are missing, or of the wrong type.  You need to know the ``MET`` value for any specific activity you are measuring.  A good list of ``MET`` values can be found at the [Compendium of Physical Activities](https://pacompendium.com).  The required body weight parameter is measured in kilograms.

```javascript
// The number of minutes MET activity is performed.
// Required and must be greater than zero.
const minutes = 35
// Weights, measured in Kilograms.  Body weight is
// required.  If a ruck weight was carried, include
// that too.  Optionally include weight of water
// carried as well.
// useful conversions: 1Kg == 2.2lbs or 1lbs === 0.45359Kg
const weights = {
  body: 70, // required Kg
  ruck: 5,  // optional Kg
  water: 0, // optional Kg
}
// The MET number for a particular task.  For example:
// Walking slowly:         2.0
// Walking, 3.0 mph:       3.0
// Weight lifting:         5.0
// Backpacking:            7.5 <-- Default value
// Swimming:               8.0
// Rope jumping (84/min): 10.5
// Jogging, 6.8 mph:      11.2
const MET = 7.5
const calories = simpleCalories(minutes, weights, MET)
console.log(calories)
// 143.381765625
```

## Advanced Calories
This method of estimating energy expenditure is based on the [Pandolf-Santee](https://en.wikipedia.org/wiki/Pandolf_equation) equation.  The required parameters include an array of GPS coordinate data, and a body weight, measured in kilograms.  Additional values can be provided in the options parameter; including the weight of a ruck load, the weight of additional water carried, and the type of terrain covered.  There is also an option to _smooth_ out the GPS elevation data.  If the elevation data comes from a GPS sensor (rather than a barometric pressure sensor), it can be useful to smooth out the values with a rolling average because some GPS sensors can provide pretty jittery values for this field.

The ``pandolfCalories()`` function expects the coordinates parameter to be an array of arrays with the following format: [longitude, latitude, heading, altitude (m), accuracy (m), timestamp (ms)].  In this particular implementation, the heading and accuracy fields are not currently being used.  Those fields can be empty or null.  The fields for longitude, latitude, altitude and timestamp must be valid, non-null values.  Altitude is measured in meters and the timestamp is Javascript default milliseconds.

**\*\*Update\*\*** The Santee correction factor for including downhill (negative grade values) is now being applied when calculating the advanced estimates.  This correction factor results in energy expenditure estimates that are typically about 16% - 20% higher when the GPS data contains significant amounts of downhill travel.

```javascript
const cooords = [
//[gps longitude,       gps latitude,      heading (in deg),   altitude (meters),  gps accuracy (m),  timestamp (ms)], 
  [-122.20916799493806, 37.82464871910401, 319.83786864113785, 179.93365394789726, 4.686741545979877, 1774574231034],
  [-122.20917657092433, 37.82465534833951, 324.6530349132338, 180.06493252050132, 4.686741545979877, 1774574232038],
  [-122.20918544242693, 37.82466679792683, 331.23548521700536, 180.14162773638964, 4.686741545979877, 1774574233040],
  ...,
]
// Optional terrain characterization values include:
// Paved road / treadmill:              1.0
// Dirt path / packed trail:            1.1
// Light off-trail, grass:              1.2
// Soft sand, deep grass, loose gravel: 1.5
// Snow, heavy brush, swamp:            1.8

// To remove GPS elevation jitter, set smooth to true.
// The window size sets amount of smoothing, 5 is usually
// sufficient.  If elevation data comes from a barometric
// sensor, set smooth to false.
const options = {
  bodyWeightKg: 70, // Required, measured in kilograms
  loadKg: 13.6,     // optional, measured in kilograms
  waterKg: 0,       // optional, measured in kilograms
  terrain: 1.1,     // optional, default value = 1.1
  smooth: true,     // optional, smooth GSP elvation values
  smoothWindow: 5,  // optional, default value = 5
}
const calories = pandofCalories(coords, options)
console.log(calories)
// 206.18971995918972
```
