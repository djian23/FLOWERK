'use client'

export default function DashboardError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2>Erreur dans le dashboard</h2>
      <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
        {error?.message}
        {'\n'}
        {error?.stack}
      </pre>
    </div>
  )
}
