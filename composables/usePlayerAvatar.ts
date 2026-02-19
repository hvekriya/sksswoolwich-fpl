const MAX_SIZE = 200
const QUALITY = 0.75

export function usePlayerAvatar() {
  const config = useRuntimeConfig()
  const hasSupabase = !!config.public?.supabase?.url

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width
          width = MAX_SIZE
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height
          height = MAX_SIZE
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
          'image/jpeg',
          QUALITY
        )
      }
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = url
    })
  }

  async function uploadAvatar(playerId: string, file: File): Promise<string> {
    const blob = await compressImage(file)

    const toDataUrl = () =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

    if (hasSupabase) {
      try {
        const supabase = useSupabaseClient()
        const path = `${playerId}.jpg`
        const { error } = await supabase.storage
          .from('player-avatars')
          .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('player-avatars').getPublicUrl(path)
        return publicUrl
      } catch (err) {
        console.warn('Avatar upload failed, using base64:', err)
        return toDataUrl()
      }
    }

    return toDataUrl()
  }

  return { compressImage, uploadAvatar }
}
