export const formatAzimuth = (azimuth: number): string => {
  return `${azimuth.toFixed(1)}°`
}

export const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(2)} км`
  }
  return `${Math.round(distance)} м`
}

export const formatDegrees = (degrees: number): string => {
  return `${degrees.toFixed(1)}°`
}
