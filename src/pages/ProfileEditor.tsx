import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Lock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { s3UploadService } from '../api/s3UploadService'
import { profileService } from '../api/profileService'
import { PageHeader } from '../components/PageHeader'

export function ProfileEditor() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [name, setName] = useState(user?.name ?? '')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  async function handleSave() {
    if (!user) return
    setLoading(true)
    setError(null)

    let pictureUrl = user.picture

    // Upload image if a new one was selected
    if (selectedFile) {
      try {
        pictureUrl = await s3UploadService.uploadImage(selectedFile)
      } catch {
        setError('Error al subir la imagen. Se conserva la foto anterior.')
        setLoading(false)
        return
      }
    }

    // Update picture in store if changed
    if (pictureUrl !== user.picture) {
      useAuthStore.getState().login({ ...user, picture: pictureUrl })
    }

    // Update name if changed
    if (name.trim() !== user.name) {
      try {
        await profileService.updateName(name.trim())
        useAuthStore.getState().login({ ...useAuthStore.getState().user!, name: name.trim() })
      } catch {
        setError('Error al actualizar el nombre.')
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(() => navigate(-1), 1200)
  }

  const avatarSrc = previewUrl ?? user?.picture ?? null

  return (
    <div className="page" style={{ background: '#181B21', minHeight: '100vh' }}>
      <PageHeader title="Editar Perfil" />

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 28px' }}>
        <div
          onClick={openFilePicker}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <div style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: '#1E2128',
            border: '2px solid #5A8A3A',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 36, color: '#5A8A3A' }}>👤</span>
            }
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            background: '#5A8A3A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #181B21',
          }}>
            <Camera size={14} color="#fff" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Fields */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Name */}
        <div>
          <label style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 6, display: 'block' }}>
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              background: '#1E2128',
              border: '1px solid #2A2D35',
              borderRadius: 12,
              padding: '12px 14px',
              color: '#fff',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            Correo electrónico
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#5A5D68', fontSize: 11 }}>
              <Lock size={10} />
              No editable
            </span>
          </label>
          <input
            type="email"
            value={user?.email ?? ''}
            readOnly
            style={{
              width: '100%',
              background: '#1E2128',
              border: '1px solid #2A2D35',
              borderRadius: 12,
              padding: '12px 14px',
              color: '#5A5D68',
              fontSize: 15,
              outline: 'none',
              cursor: 'not-allowed',
              opacity: 0.6,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ margin: '16px 16px 0', padding: '12px 14px', background: 'rgba(231,76,60,0.12)', borderRadius: 10, color: '#E74C3C', fontSize: 13 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ margin: '16px 16px 0', padding: '12px 14px', background: 'rgba(90,138,58,0.15)', borderRadius: 10, color: '#5A8A3A', fontSize: 13 }}>
          ¡Perfil actualizado correctamente!
        </div>
      )}

      {/* Save button */}
      <div style={{ padding: '24px 16px' }}>
        <button
          onClick={handleSave}
          disabled={loading || success}
          style={{
            width: '100%',
            padding: '14px',
            background: loading || success ? '#3a5a28' : '#5A8A3A',
            border: 'none',
            borderRadius: 14,
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading || success ? 'not-allowed' : 'pointer',
            opacity: loading || success ? 0.7 : 1,
          }}
        >
          {loading ? 'Guardando...' : success ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
