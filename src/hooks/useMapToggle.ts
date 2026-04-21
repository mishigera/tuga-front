import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { Geolocation } from '@capacitor/geolocation'

const token = (import.meta as any).env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = token

const DEFAULT_COORDS = {
  lat: 20.527869,
  lng: -102.333137,
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Builds a GeoJSON polygon approximating a circle of `radiusMeters` around a point. */
function circleGeoJSON(centerLat: number, centerLng: number, radiusMeters: number) {
  const steps = 64
  const coords: [number, number][] = []
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    const dx = radiusMeters * Math.sin(angle)
    const dy = radiusMeters * Math.cos(angle)
    const lat = centerLat + dy / 111320
    const lng = centerLng + dx / (111320 * Math.cos((centerLat * Math.PI) / 180))
    coords.push([lng, lat])
  }
  coords.push(coords[0]) // close ring
  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  }
}

export function useMapToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOutOfRange, setIsOutOfRange] = useState(false)
  const [geolocating, setGeolocating] = useState(false)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gpsRef = useRef<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [DEFAULT_COORDS.lng, DEFAULT_COORDS.lat],
      zoom: 15,
      collectResourceTiming: false,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    // Draggable green pin — starts at default, moves to GPS on load
    const marker = new mapboxgl.Marker({ color: '#5A8A3A', draggable: true })
      .setLngLat([DEFAULT_COORDS.lng, DEFAULT_COORDS.lat])
      .addTo(map)

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLngLat()

      // Snap back if dragged outside the 30 m radius circle
      if (gpsRef.current) {
        const dist = haversineKm(gpsRef.current.lat, gpsRef.current.lng, lat, lng)
        if (dist > 0.03) {
          marker.setLngLat([gpsRef.current.lng, gpsRef.current.lat])
          return
        }
      }

      // TODO: enable in production — validates 7 km delivery radius
      // const distCenter = haversineKm(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng, lat, lng)
      // setIsOutOfRange(distCenter > 7)
      setIsOutOfRange(false)
    })

    mapRef.current = map
    markerRef.current = marker

    map.once('load', async () => {
      setGeolocating(true)
      try {
        let perm = await Geolocation.checkPermissions()
        if (perm.location === 'prompt' || perm.location === 'prompt-with-rationale') {
          perm = await Geolocation.requestPermissions()
        }
        if (perm.location === 'denied') {
          setGeolocating(false)
          return
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 8000,
        })
        const { latitude: lat, longitude: lng } = pos.coords
        gpsRef.current = { lat, lng }

        marker.setLngLat([lng, lat])
        map.easeTo({ center: [lng, lat], zoom: 17, duration: 600 })

        // GPS point — two canvas circle layers (not DOM, unaffected by overflow:hidden)
        map.addSource('gps-point', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: {} },
        })
        // Outer pulse ring
        map.addLayer({
          id: 'gps-dot-pulse',
          type: 'circle',
          source: 'gps-point',
          paint: { 'circle-radius': 16, 'circle-color': '#4A90E2', 'circle-opacity': 0.2 },
        })
        // Inner solid dot
        map.addLayer({
          id: 'gps-dot-core',
          type: 'circle',
          source: 'gps-point',
          paint: {
            'circle-radius': 7,
            'circle-color': '#4A90E2',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#fff',
          },
        })

        // 30 m radius circle — visible at zoom 17 (~24 px radius)
        map.addSource('gps-radius', {
          type: 'geojson',
          data: circleGeoJSON(lat, lng, 30),
        })
        map.addLayer({
          id: 'gps-radius-fill',
          type: 'fill',
          source: 'gps-radius',
          paint: { 'fill-color': '#4A90E2', 'fill-opacity': 0.08 },
        })
        map.addLayer({
          id: 'gps-radius-stroke',
          type: 'line',
          source: 'gps-radius',
          paint: { 'line-color': '#4A90E2', 'line-width': 1.5, 'line-dasharray': [3, 3] },
        })

        setGeolocating(false)
      } catch {
        setGeolocating(false)
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      gpsRef.current = null
      setGeolocating(false)
    }
  }, [isOpen])

  const open = () => setIsOpen(true)
  const close = () => { setIsOpen(false); setIsOutOfRange(false) }
  const getMarkerCoords = () => markerRef.current?.getLngLat()

  return { isOpen, open, close, containerRef, getMarkerCoords, isOutOfRange, geolocating }
}
