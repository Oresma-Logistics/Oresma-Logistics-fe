/**
 * Calculate ride price based on distance and vehicle type
 * @param distanceKm - Distance in kilometers
 * @param vehicleType - Type of vehicle (keke, car, dispatch, lorry)
 * @returns Calculated price in Naira
 */
export function calculateRidePrice(
  distanceKm: number,
  vehicleType: string = "keke"
): number {
  // Pricing structure for different vehicle types
  const pricing = {
    keke: {
      baseFare: 500, // Base fare in Naira
      perKm: 250, // Rate per kilometer in Naira
      minimumFare: 800, // Minimum fare
    },
    car: {
      baseFare: 1000,
      perKm: 500,
      minimumFare: 2500,
    },
    dispatch: {
      baseFare: 800,
      perKm: 400,
      minimumFare: 1800,
    },
    lorry: {
      baseFare: 2000,
      perKm: 800,
      minimumFare: 5000,
    },
  };

  const rates = pricing[vehicleType as keyof typeof pricing] || pricing.keke;

  // Calculate: base fare + (distance * rate per km)
  const calculatedPrice = rates.baseFare + distanceKm * rates.perKm;

  // Return the higher of calculated price or minimum fare
  return Math.max(calculatedPrice, rates.minimumFare);
}

/**
 * Format price in Nigerian Naira format
 * @param price - Price in Naira
 * @returns Formatted price string (e.g., "₦2,500")
 */
export function formatNairaPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}
