/**
 * Converts distance in KM to an estimated time string.
 * @param distanceKm The distance in kilometers
 * @param averageSpeedKmh The estimated speed in km/h (default is 40km/h)
 * @returns A formatted string like "1 hr 15 mins"
 */
export const calculateETA = (
  distanceKm: number,
  averageSpeedKmh: number = 40,
): string => {
  if (!distanceKm) return "0 mins";

  // Calculate total time in hours
  const totalHours = distanceKm / averageSpeedKmh;

  // Extract hours and minutes
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  // Format the output
  if (hours === 0) {
    return `${minutes} mins`;
  } else if (minutes === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  } else {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} mins`;
  }
};

// Usage:
// console.log(calculateETA(18.45, 40)); // Output: "27 mins"
// console.log(calculateETA(65, 50));    // Output: "1 hr 18 mins"
