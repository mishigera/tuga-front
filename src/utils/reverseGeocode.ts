// services/geocoding.ts
import mbxGeoCoding from '@mapbox/mapbox-sdk/services/geocoding'
const token = (import.meta as any).env.VITE_MAPBOX_TOKEN
const client = mbxGeoCoding({
  accessToken: token
})

export interface ReverseGeocodeResult {
  address: string
  lat: number
  lng: number
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  const response = await client
    .reverseGeocode({ query: `${lng},${lat}` }) // Mapbox: "lng,lat"
    .send()

  const feature = response.body.features[0]

  if (!feature) {
    throw new Error('No se encontró dirección para estas coordenadas')
  }

  return {
    address: feature.place_name,  // "Av. Vallarta 1234, Guadalajara..."
    lat,
    lng
  }
}