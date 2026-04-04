import { normalizeFileName } from '../utils/profileUtils'
// import { api } from './client'  // ← descomentar cuando el backend esté listo

// Cuando el backend esté listo:
// 1. Descomentar el import de `api` arriba
// 2. Reemplazar el bloque mock por:
//    const formData = new FormData()
//    formData.append('file', new File([file], normalizeFileName(file), { type: file.type }))
//    const res = await api.postForm<{ url: string }>('/upload', formData)
//    return res.url

export const s3UploadService = {
  async uploadImage(file: File): Promise<string> {
    const normalizedName = normalizeFileName(file)
    const formData = new FormData()
    formData.append('file', new File([file], normalizedName, { type: file.type }))

    // MOCK: retorna URL ficticia
    void formData
    return `https://mock-s3.tuga.app/profile-images/${crypto.randomUUID()}.jpg`
  },
}
