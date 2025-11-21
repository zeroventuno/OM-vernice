'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import Image from 'next/image'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Validate password match
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            setLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.')
            setLoading(false)
            return
        }

        const { data, error } = await signUp(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-lg)'
            }}>
                <div className="card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'hsla(142, 71%, 45%, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)',
                        fontSize: '2.5rem'
                    }}>
                        ✓
                    </div>
                    <h2>Registro Realizado!</h2>
                    <p style={{ marginBottom: 'var(--spacing-xl)' }}>
                        Sua conta foi criada com sucesso. Aguarde a aprovação de um administrador para acessar o sistema.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        )
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
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Criar Conta</h1>
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
                        <p className="text-small text-muted" style={{ marginTop: 'var(--spacing-xs)' }}>
                            Apenas emails @officinemattio.com são permitidos
                        </p>
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

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">
                            Confirmar Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            'Registrar'
                        )}
                    </button>

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Já tem uma conta?{' '}
                        <a
                            href="/auth/login"
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            Entrar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
