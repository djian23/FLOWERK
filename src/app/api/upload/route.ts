import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${uuidv4()}.${ext}`

    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url, name: file.name })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
