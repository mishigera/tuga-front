// Cuando el backend esté listo, reemplazar por:
// updateName: api.patch<void>('/users/me', { name })

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

export const profileService = {
  async updateName(name: string): Promise<void> {
    await delay()
    // Mock: simula actualización exitosa
    void name
  },
}
