export async function uploadFile(file: File): Promise<string> {
  const processedFile = file.type.startsWith('image/') ? await compressImage(file) : file

  const fd = new FormData()
  fd.append('file', processedFile)

  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.text().catch(() => 'Upload failed')
    throw new Error(err)
  }

  const data = await res.json()
  if (!data.url) throw new Error('No URL returned')
  return data.url
}

function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let w = img.width
      let h = img.height

      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w)
        w = maxWidth
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          } else {
            resolve(file)
          }
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}
