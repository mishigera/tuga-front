import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { shopsApi } from '../api/shops'
import { useFavoritesStore } from '../store/authStore'
import { RestaurantCard } from '../components/RestaurantCard'

export function Favorites() {
  const { favorites } = useFavoritesStore()

  const { data: shops, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: shopsApi.getAll,
  })

  const favoriteShops = shops?.filter((s) => favorites.includes(s._id)) ?? []

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 20px' }}>
        <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1 }}>
          Mis Favoritos
        </span>
        {favorites.length > 0 && (
          <span style={{
            background: '#5A8A3A',
            color: '#fff',
            borderRadius: '50%',
            width: 22,
            height: 22,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {favorites.length}
          </span>
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        {isLoading && <div className="spinner" />}

        {!isLoading && favoriteShops.length === 0 && (
          <div className="error-state" style={{ minHeight: '60vh' }}>
            <Heart size={48} color="#5A5D68" />
            <p style={{ fontWeight: 600 }}>Aún no tienes favoritos</p>
            <p style={{ fontSize: 13 }}>Guarda tus restaurantes favoritos tocando el corazón</p>
          </div>
        )}

        {favoriteShops.map((shop) => (
          <RestaurantCard key={shop._id} shop={shop} />
        ))}
      </div>
    </div>
  )
}
