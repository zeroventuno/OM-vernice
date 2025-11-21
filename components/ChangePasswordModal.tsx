import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/lib/translations'

type ChangePasswordModalProps = {
    onClose: () => void
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const { language } = useLanguage()
    const t = useTranslation(language)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (newPassword !== confirmPassword) {
            setError(language === 'pt-BR' ? 'As senhas não coincidem' : 'Le password non coincidono')
            return
        }

        if (newPassword.length < 6) {
            setError(language === 'pt-BR' ? 'A senha deve ter pelo menos 6 caracteres' : 'La password deve avere almeno 6 caratteri')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (err) {
            console.error('Error updating password:', err)
            setError(language === 'pt-BR' ? 'Erro ao atualizar senha' : 'Errore durante l\'aggiornamento della password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: '400px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 style={{ margin: 0 }}>
                        {language === 'pt-BR' ? 'Alterar Senha' : 'Cambia Password'}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            padding: '0',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {success ? (
                        <div style={{
                            padding: 'var(--spacing-lg)',
                            textAlign: 'center',
                            color: 'var(--color-success)',
                            fontWeight: 600
                        }}>
                            {language === 'pt-BR' ? 'Senha atualizada com sucesso!' : 'Password aggiornata con successo!'}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {error && (
                                <div style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-error-bg)',
                                    color: 'var(--color-error)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="form-label">
                                    {language === 'pt-BR' ? 'Nova Senha' : 'Nuova Password'}
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="form-label">
                                    {language === 'pt-BR' ? 'Confirmar Senha' : 'Conferma Password'}
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    {t.common.cancel}
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? '...' : t.common.save}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
