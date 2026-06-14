'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Identifiants incorrects. Veuillez réessayer.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-[#0A0A0A] tracking-widest mb-2">
            FLOWER K
          </h1>
          <p className="text-[#C4B8A8] text-sm tracking-[0.3em] uppercase">
            Administration
          </p>
        </div>

        <div className="bg-white border border-[#E8E0D5] rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-medium text-[#0A0A0A] mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8] bg-[#FAFAFA]"
                placeholder="admin@flowerk.fr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8] bg-[#FAFAFA]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0A0A0A] text-white text-sm font-medium rounded-md hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
