# Estimating Energy Expenditure Using The Pandolf-Santee Equation

Estimating the number of calories burned during a physical activity period is notoriously difficult, especially when attempting to incorporate accurate GPS data.  Most instances of estimating calories burned are simply calculated as an exertion effort based on body weight, time duration and a known __MET__ (Metabolic Equivalent Task) value for a given activity.  This method doesn't include positional data such as distance, velocity or elevation changes.  This can be considered a simple calorie estimates.

There are several, more advanced methods for estimating calories burned that do attempt to incorporate GPS data for a richer, more nuanced estimate.  The Pandolf-Santee equation makes an effort to use as much data as possible, but it's still just an estimate.

## Using 

```bash
npm install --save @mattduffy/calories
```

```javascript
import { simpleCalories, pandolfCaloires } from '@mattduffy/calories'
```
