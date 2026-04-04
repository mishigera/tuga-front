import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { getInviteMessage } from '../utils/profileUtils'

export function InviteFeature() {
  const [copied, setCopied] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  const message = getInviteMessage()

  async function handleShare() {
    if (navigator.share !== undefined) {
      try {
        await navigator.share({ text: message })
      } catch {
        // user cancelled or error — do nothing
      }
    } else {
      setShowFallback(true)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page" style={{ background: '#181B21', minHeight: '100vh' }}>
      <PageHeader title="Invitar Amigos" />

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 24px' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(90,138,58,0.12)',
          border: '2px solid #5A8A3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Share2 size={36} color="#5A8A3A" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
          Comparte con tus amigos
        </h2>
        <p style={{ fontSize: 14, color: '#9A9DA8', textAlign: 'center', lineHeight: 1.5 }}>
          Invita a tus amigos y gana descuentos especiales
        </p>
      </div>

      {/* Message preview */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{
          background: '#1E2128',
          borderRadius: 14,
          padding: '16px',
          border: '1px solid rgba(90,138,58,0.2)',
        }}>
          <p style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Mensaje de invitación
          </p>
          <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6 }}>{message}</p>
        </div>
      </div>

      {/* Main CTA */}
      <div style={{ padding: '0 16px' }}>
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            padding: '14px',
            background: '#5A8A3A',
            border: 'none',
            borderRadius: 14,
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Share2 size={18} />
          Compartir con un amigo
        </button>
      </div>

      {/* Fallback: shown when Web Share API is not available */}
      {showFallback && (
        <div style={{ padding: '24px 16px 0' }}>
          <div style={{
            background: '#1E2128',
            borderRadius: 14,
            padding: '16px',
            border: '1px solid rgba(90,138,58,0.3)',
          }}>
            <p style={{ fontSize: 13, color: '#9A9DA8', marginBottom: 12 }}>
              Tu dispositivo no soporta compartir directamente. Copia el mensaje:
            </p>
            <p style={{
              fontSize: 14,
              color: '#fff',
              background: '#181B21',
              borderRadius: 10,
              padding: '12px',
              marginBottom: 12,
              lineHeight: 1.6,
            }}>
              {message}
            </p>
            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                padding: '12px',
                background: copied ? 'rgba(90,138,58,0.2)' : 'transparent',
                border: `1px solid ${copied ? '#5A8A3A' : '#5A8A3A'}`,
                borderRadius: 10,
                color: '#5A8A3A',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
