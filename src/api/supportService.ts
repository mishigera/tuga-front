import type { FeedbackPayload, SupportPhone } from '../types'

// Cuando el backend esté listo, reemplazar por:
// getPhoneNumbers: api.get<SupportPhone[]>('/support/phones')
// submitFeedback:  api.post<void>('/support/feedback', payload)

const MOCK_PHONES: SupportPhone[] = [
  { label: 'Soporte General', number: '+52 55 0000 0001' },
  { label: 'Atención a Pedidos', number: '+52 55 0000 0002' },
]

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

export const supportService = {
  async getPhoneNumbers(): Promise<SupportPhone[]> {
    await delay()
    return [...MOCK_PHONES]
  },

  async submitFeedback(payload: FeedbackPayload): Promise<void> {
    await delay()
    // Mock: simula envío exitoso
    void payload
  },
}
