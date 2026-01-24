/**
 * Pricing breakdown interface for detailed fare calculation
 */
export interface PricingBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  serviceFee: number;
  total: number;
  distanceKm: number;
  estimatedTimeMinutes: number;
}

/**
 * Calculate logistics price based on distance, time, and vehicle type
 * Pricing model based on research:
 * - Bolt/inDrive (ride-hailing): ₦2,700 for 7.8km = ₦346/km
 * - Chowdeck (logistics): ₦4,500 for 7.8km = ₦577/km (67% premium)
 * 
 * This service uses logistics pricing (closer to Chowdeck) with competitive rates
 * @param distanceKm - Distance in kilometers
 * @param estimatedTimeMinutes - Estimated travel time in minutes
 * @param vehicleType - Type of vehicle (motorcycle, car, truck)
 * @returns Pricing breakdown with all components
 */
export function calculateLogisticsPrice(
  distanceKm: number,
  estimatedTimeMinutes: number = 0,
  vehicleType: string = "motorcycle"
): PricingBreakdown {
  // Pricing structure based on research data
  // Logistics services charge ~67% more than ride-hailing due to:
  // - Waiting time at pickup/delivery locations
  // - Package handling and insurance
  // - Lower trip volume
  // - Specialized door-to-door service
  
  const pricing = {
    motorcycle: {
      baseFare: 600, // Base fare in Naira
      perKm: 350, // Rate per kilometer (₦346/km for ride-hailing, ~₦350 for logistics)
      perMinute: 15, // Rate per minute for waiting/travel time
      serviceFee: 200, // Logistics service fee
      minimumFare: 1200, // Minimum fare
    },
    car: {
      baseFare: 1000,
      perKm: 500, // Higher rate for cars
      perMinute: 25,
      serviceFee: 300,
      minimumFare: 2500,
    },
    truck: {
      baseFare: 2000,
      perKm: 800, // Highest rate for trucks
      perMinute: 40,
      serviceFee: 500,
      minimumFare: 5000,
    },
    // Legacy vehicle types for backward compatibility
    keke: {
      baseFare: 600,
      perKm: 350,
      perMinute: 15,
      serviceFee: 200,
      minimumFare: 1200,
    },
    dispatch: {
      baseFare: 800,
      perKm: 400,
      perMinute: 20,
      serviceFee: 250,
      minimumFare: 1800,
    },
    lorry: {
      baseFare: 2000,
      perKm: 800,
      perMinute: 40,
      serviceFee: 500,
      minimumFare: 5000,
    },
  };

  // Normalize vehicle type (handle variations)
  const normalizedType = vehicleType.toLowerCase();
  const rates = pricing[normalizedType as keyof typeof pricing] || pricing.motorcycle;

  // Calculate individual components
  const baseFare = rates.baseFare;
  const distanceFare = Math.round(distanceKm * rates.perKm);
  const timeFare = Math.round(estimatedTimeMinutes * rates.perMinute);
  const serviceFee = rates.serviceFee;

  // Calculate total
  let total = baseFare + distanceFare + timeFare + serviceFee;

  // Apply minimum fare if calculated total is lower
  total = Math.max(total, rates.minimumFare);

  return {
    baseFare,
    distanceFare,
    timeFare,
    serviceFee,
    total,
    distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal place
    estimatedTimeMinutes: Math.round(estimatedTimeMinutes),
  };
}

/**
 * Calculate ride price based on distance and vehicle type (legacy function for backward compatibility)
 * @param distanceKm - Distance in kilometers
 * @param vehicleType - Type of vehicle (keke, car, dispatch, lorry)
 * @returns Calculated price in Naira
 */
export function calculateRidePrice(
  distanceKm: number,
  vehicleType: string = "keke"
): number {
  const breakdown = calculateLogisticsPrice(distanceKm, 0, vehicleType);
  return breakdown.total;
}

/**
 * Format price in Nigerian Naira format
 * @param price - Price in Naira
 * @returns Formatted price string (e.g., "₦2,500")
 */
export function formatNairaPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}

/**
 * Calculate distance between two addresses using Google Maps Directions API
 * @param origin - Origin address
 * @param destination - Destination address
 * @returns Promise with distance in kilometers and time in minutes, or null if error
 */
export async function calculateRouteDistance(
  origin: string,
  destination: string
): Promise<{ distanceKm: number; timeMinutes: number } | null> {
  if (!origin || !destination) return null;
  if (!window.google || !window.google.maps) return null;

  try {
    const directionsService = new window.google.maps.DirectionsService();

    const result = await new Promise<google.maps.DirectionsResult>(
      (resolve, reject) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (
              status === window.google.maps.DirectionsStatus.OK &&
              response
            ) {
              resolve(response);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          }
        );
      }
    );

    if (result.routes[0]?.legs[0]) {
      const leg = result.routes[0].legs[0];
      const distanceMeters = leg.distance?.value || 0;
      const durationSeconds = leg.duration?.value || 0;

      const distanceKm = distanceMeters / 1000;
      const timeMinutes = durationSeconds / 60;

      return { distanceKm, timeMinutes };
    }

    return null;
  } catch (error) {
    console.error("Error calculating route distance:", error);
    return null;
  }
}
