interface Props {
  variant: 'restaurant' | 'menu-item'
}

export function SkeletonCard({ variant }: Props) {
  if (variant === 'restaurant') {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        {/* Image area — 160px height */}
        <div
          className="skeleton-shimmer"
          style={{ height: 160, width: '100%' }}
        />
        <div style={{ padding: '14px 16px 16px' }}>
          {/* Name + badge row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div
              className="skeleton-shimmer"
              style={{ height: 18, width: '55%', borderRadius: 4 }}
            />
            <div
              className="skeleton-shimmer"
              style={{ height: 18, width: '22%', borderRadius: 4 }}
            />
          </div>
          {/* Description */}
          <div
            className="skeleton-shimmer"
            style={{ height: 13, width: '90%', borderRadius: 4, marginBottom: 6 }}
          />
          <div
            className="skeleton-shimmer"
            style={{ height: 13, width: '70%', borderRadius: 4, marginBottom: 10 }}
          />
          {/* Time row */}
          <div
            className="skeleton-shimmer"
            style={{ height: 12, width: '30%', borderRadius: 4 }}
          />
        </div>
      </div>
    )
  }

  // variant === 'menu-item'
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      borderBottom: '1px solid #252830',
      alignItems: 'center',
    }}>
      {/* Image — 72×72 */}
      <div
        className="skeleton-shimmer"
        style={{ width: 72, height: 72, borderRadius: 12, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name */}
        <div
          className="skeleton-shimmer"
          style={{ height: 15, width: '60%', borderRadius: 4, marginBottom: 8 }}
        />
        {/* Description lines */}
        <div
          className="skeleton-shimmer"
          style={{ height: 12, width: '90%', borderRadius: 4, marginBottom: 4 }}
        />
        <div
          className="skeleton-shimmer"
          style={{ height: 12, width: '70%', borderRadius: 4, marginBottom: 8 }}
        />
        {/* Price */}
        <div
          className="skeleton-shimmer"
          style={{ height: 15, width: '25%', borderRadius: 4 }}
        />
      </div>
      {/* Add button placeholder */}
      <div
        className="skeleton-shimmer"
        style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0 }}
      />
    </div>
  )
}
