import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  title: string
  onBack?: () => void
  right?: ReactNode
}

export function PageHeader({ title, onBack, right }: Props) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px 16px 12px',
      gap: 12,
    }}>
      <button
        onClick={onBack ?? (() => navigate(-1))}
        style={{
          background: '#1E2128',
          border: 'none',
          borderRadius: 10,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={18} color="#fff" />
      </button>
      <h1 style={{ flex: 1, fontSize: 18, fontWeight: 700, color: '#fff' }}>{title}</h1>
      {right}
    </div>
  )
}
