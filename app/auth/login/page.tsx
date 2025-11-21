'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-primary)',
            padding: 'var(--spacing-lg)'
        }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <Image
                        src="/logo.png"
                        alt="Officine Mattio"
                        width={200}
                        height={60}
                        style={{ margin: '0 auto', marginBottom: 'var(--spacing-lg)', objectFit: 'contain' }}
                        priority
                    />
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Bem-vindo</h1>
                    <p className="text-muted">Sistema de Gestão de Pintura</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'hsla(0, 72%, 51%, 0.1)',
                            border: '1px solid var(--color-error)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-error)',
                            marginBottom: 'var(--spacing-lg)',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="seu.email@officinemattio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner" style={{ width: '1.25rem', height: '1.25rem' }}></span>
                        ) : (
                            'Entrar'
                        )}
                    </button>

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Não tem uma conta?{' '}
                        <a
                            href="/auth/register"
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            Registrar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
