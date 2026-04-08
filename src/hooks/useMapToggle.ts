
import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

const token = (import.meta as any).env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = token

const DEFAULT_COORDS = {
  lat: 20.527869,  // centro de ayotlan como fallback
  lng: -102.333137
}

export function useMapToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    // Inicializar mapa solo cuando se abre
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [DEFAULT_COORDS.lng, DEFAULT_COORDS.lat],
      zoom: 15,
      collectResourceTiming: false
    })
    

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([DEFAULT_COORDS.lng, DEFAULT_COORDS.lat])
      .addTo(map)

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false
    }))

    mapRef.current = map
    markerRef.current = marker

    // Limpiar al cerrar
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [isOpen])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const getMarkerCoords = () => markerRef.current?.getLngLat()

  return { isOpen, open, close, containerRef, getMarkerCoords }
}