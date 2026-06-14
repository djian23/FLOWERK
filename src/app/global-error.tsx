'use client'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#FAFAFA' }}>
        <h1 style={{ color: '#0A0A0A' }}>Erreur</h1>
        <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {error?.message}
          {'\n'}
          {error?.stack}
        </pre>
        <p style={{ color: '#888', fontSize: '12px' }}>digest: {error?.digest}</p>
      </body>
    </html>
  )
}
