import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  componentStack: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, componentStack: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, componentStack: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
    this.setState({ componentStack: info.componentStack ?? null })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, componentStack: null })
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '32px 24px',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(231,76,60,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={28} color="#E74C3C" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
          Algo salió mal
        </h2>
        <p style={{ fontSize: 14, color: '#9A9DA8', margin: 0, lineHeight: 1.5 }}>
          Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
        </p>
        {this.state.error && (
          <div
            style={{
              width: '100%',
              background: '#1E2128',
              border: '1px solid #252830',
              borderRadius: 10,
              padding: 12,
              textAlign: 'left',
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#E74C3C', margin: '0 0 6px' }}>
              {this.state.error.name}: {this.state.error.message}
            </p>
            {this.state.componentStack && (
              <pre
                style={{
                  fontSize: 10,
                  color: '#9A9DA8',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                }}
              >
                {this.state.componentStack}
              </pre>
            )}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
          <button className="btn-primary" onClick={this.handleRetry}>
            <RotateCcw size={16} />
            Intentar de nuevo
          </button>
          <button className="btn-secondary" onClick={this.handleReload}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }
}
