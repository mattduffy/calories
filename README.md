# Estimating Energy Expenditure Using The Pandolf-Santee Equation

Creating accurate estimates of the number of calories burned during a physical activity period is notoriously difficult, especially when attempting to incorporate positional data.  Most instances of estimating calories burned are simply calculated as an exertion effort based on body weight, time duration and a known __MET__ ([Metabolic Equivalent Task](https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task)) value for a given activity.  This method doesn't include positional data such as distance, velocity or elevation changes.  This can be considered a simple calorie estimates.

There are several, more advanced methods for estimating calories burned that do attempt to incorporate GPS data for a richer, more nuanced estimate.  The Pandolf-Santee equation makes an effort to use as much data as possible, but it's still just an estimate.

This package provides functions for both simple calorie estimates, and a more advanced method based on the Pandolf-Santee formula.

## Using 

```bash
npm install --save @mattduffy/calories
```

```javascript
import { simpleCalories, pandolfCalories } from '@mattduffy/calories'
```

## Simple Calories
The simple calories calculation takes 3 parameters: ``minutes``, ``weights``, and ``MET``, and returns a positive floating point value.  The function throws an ``Error`` if the required parameters are missing, or of the wrong type.
```javascript
// The number of minutes MET activity is performed.
// Required and must be greater than zero.
const minutes = 35
// Weights, measured in Kilograms.  Body weight is
// required.  If a ruck weight was carried, include
// that too.  Optionally include weight of water
// carried as well.
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
const calories = simpleCalories(minutes, weights, MET)
console.log(calories)
// 143.381765625
```

## Advanced Calories
