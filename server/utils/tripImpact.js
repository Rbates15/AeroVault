/**
 * AeroVault — Trip Impact Calculator
 *
 * Estimates per-passenger CO2 emissions using a simplified ICAO methodology.
 * All figures are approximations and labeled as such in the UI.
 *
 * Formula:
 *   CO2_kg = distance_km × EMISSION_FACTOR × cabin_multiplier × RADIATIVE_FORCING
 *
 * Constants:
 *   EMISSION_FACTOR    = 0.115 kg CO2 per passenger-km (ICAO average for commercial aviation)
 *   RADIATIVE_FORCING  = 1.9   (accounts for non-CO2 warming effects at altitude)
 *   cabin_multiplier   = 1.0 (Economy) | 1.5 (Business)
 *
 * Impact score maps CO2_kg onto a 1–10 scale with Low / Moderate / High / Very High bands.
 */

const EMISSION_FACTOR   = 0.115; // kg CO2 per passenger-km
const RADIATIVE_FORCING = 1.9;   // altitude warming multiplier

const CABIN_MULTIPLIERS = {
  Economy:  1.0,
  Business: 1.5,
};

/**
 * Returns impact score (1–10), classification, and color key
 * based on calculated CO2 in kg.
 */
function getImpactScore(co2Kg) {
  if (co2Kg < 100) {
    return { score: Math.max(1, Math.round(co2Kg / 50)),       classification: 'Low',       colorKey: 'low' };
  } else if (co2Kg < 300) {
    return { score: Math.round(2 + ((co2Kg - 100) / 200) * 2), classification: 'Low–Moderate', colorKey: 'low' };
  } else if (co2Kg < 600) {
    return { score: Math.round(4 + ((co2Kg - 300) / 300) * 2), classification: 'Moderate',   colorKey: 'moderate' };
  } else if (co2Kg < 900) {
    return { score: Math.round(6 + ((co2Kg - 600) / 300) * 2), classification: 'High',       colorKey: 'high' };
  } else {
    return { score: Math.min(10, Math.round(8 + ((co2Kg - 900) / 500) * 2)), classification: 'Very High', colorKey: 'very-high' };
  }
}

/**
 * Returns a plain-English explanation sentence based on the distance tier and classification.
 */
function getExplanation(distanceKm, classification, co2Kg) {
  const rounded = Math.round(co2Kg);

  if (distanceKm < 800) {
    return `This is a short-haul flight. At approximately ${rounded} kg CO₂ per passenger, it falls in the ${classification.toLowerCase()} range for aviation emissions.`;
  } else if (distanceKm < 2500) {
    return `This regional flight produces approximately ${rounded} kg CO₂ per passenger, a ${classification.toLowerCase()} impact typical of medium-distance domestic routes.`;
  } else if (distanceKm < 5000) {
    return `At approximately ${rounded} kg CO₂ per passenger, this cross-country flight has a ${classification.toLowerCase()} emissions impact compared to other commercial flights.`;
  } else if (distanceKm < 9000) {
    return `Long-haul flights carry a higher footprint. This route produces approximately ${rounded} kg CO₂ per passenger, placing it in the ${classification.toLowerCase()} range.`;
  } else {
    return `Ultra long-haul flights have the highest footprint in commercial aviation. This route produces approximately ${rounded} kg CO₂ per passenger — a ${classification.toLowerCase()} impact.`;
  }
}

/**
 * Main export. Calculates the full Trip Impact object for a given flight.
 *
 * @param {number} distanceKm   - Great-circle distance stored on the flight record
 * @param {string} cabinClass   - "Economy" or "Business"
 * @returns {object}            - Full impact object ready to serialize as JSON
 */
export function calculateTripImpact(distanceKm, cabinClass = 'Economy') {
  const multiplier = CABIN_MULTIPLIERS[cabinClass] ?? CABIN_MULTIPLIERS.Economy;
  const co2Kg      = distanceKm * EMISSION_FACTOR * multiplier * RADIATIVE_FORCING;
  const co2Rounded = Math.round(co2Kg);

  const { score, classification, colorKey } = getImpactScore(co2Kg);
  const explanation = getExplanation(distanceKm, classification, co2Kg);

  return {
    co2_kg:         co2Rounded,
    score,                          // 1–10
    score_max:      10,
    classification,                 // "Low" | "Low–Moderate" | "Moderate" | "High" | "Very High"
    color_key:      colorKey,       // "low" | "moderate" | "high" | "very-high"
    cabin_class:    cabinClass,
    distance_km:    distanceKm,
    disclaimer:     'CO₂ estimate uses ICAO methodology. Figures are approximate and for informational purposes only.',
    explanation,
  };
}
