import { /*useEffect,*/ useState } from 'react'
import {  Send, CheckCircle, CameraIcon } from 'lucide-react'
import { supportService } from '../api/supportService'
import { PageHeader } from '../components/PageHeader'
import type { /*SupportPhone,*/ FeedbackPayload } from '../types'

const MAX_CHARS = 500

export function SupportCenter() {
  // const [phones, setPhones] = useState<SupportPhone[]>([])
  const [subject, setSubject] = useState<FeedbackPayload['subject']>('queja')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // useEffect(() => {
  //   supportService.getPhoneNumbers().then(setPhones)
  // }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      await supportService.submitFeedback({ subject, message })
      setSent(true)
      setMessage('')
      setSubject('queja')
      setTimeout(() => setSent(false), 3000)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page" style={{ background: '#181B21', minHeight: '100vh' }}>
      <PageHeader title="Ayuda y Soporte" />

      {/* Teléfonos */}
      <div style={{ padding: '8px 16px 24px' }}>
        <p style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Contáctanos
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Instagram */}
            <a
              key="instagram"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#1E2128',
                borderRadius: 14,
                padding: '14px 16px',
                textDecoration: 'none',
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                background: 'rgba(90,138,58,0.12)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <CameraIcon size={18} color="#5A8A3A" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Instagram</div>
                <div style={{ fontSize: 13, color: '#9A9DA8' }}>@Tuga_App</div>
              </div>
            </a>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ padding: '0 16px 32px' }}>
        <p style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Quejas y Sugerencias
        </p>

        {sent && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(90,138,58,0.15)',
            border: '1px solid rgba(90,138,58,0.4)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
          }}>
            <CheckCircle size={18} color="#5A8A3A" />
            <span style={{ fontSize: 14, color: '#5A8A3A', fontWeight: 600 }}>
              ¡Mensaje enviado con éxito!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as FeedbackPayload['subject'])}
            style={{
              background: '#1E2128',
              border: '1px solid #2A2D35',
              borderRadius: 12,
              padding: '12px 14px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="queja">Queja</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="otro">Otro</option>
          </select>

          <div style={{ position: 'relative' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              style={{
                background: '#1E2128',
                border: '1px solid #2A2D35',
                borderRadius: 12,
                padding: '12px 14px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                width: '100%',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: 10,
              right: 14,
              fontSize: 12,
              color: message.length >= MAX_CHARS ? '#E74C3C' : '#9A9DA8',
            }}>
              {message.length}/{MAX_CHARS}
            </span>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || sending}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: !message.trim() || sending ? '#2A2D35' : '#5A8A3A',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              color: !message.trim() || sending ? '#9A9DA8' : '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: !message.trim() || sending ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <Send size={16} />
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
