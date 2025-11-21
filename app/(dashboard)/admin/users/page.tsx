'use client'

import { useEffect, useState } from 'react'
import { supabase, type User } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminUsersPage() {
    const { t } = useLanguage()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateUserStatus(userId: string, status: 'approved' | 'rejected') {
        try {
            const { error } = await supabase
                .from('users')
                .update({ status })
                .eq('id', userId)

            if (error) throw error

            // Reload users
            await loadUsers()
        } catch (error) {
            console.error('Error updating user:', error)
            alert(t.common.error)
        }
    }

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true
        return user.status === filter
    })

    const pendingCount = users.filter(u => u.status === 'pending').length

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>{t.users.title}</h1>
                <p className="text-muted">{t.users.subtitle}</p>
            </div>

            {/* Stats */}
            {pendingCount > 0 && (
                <div style={{
                    padding: 'var(--spacing-lg)',
                    background: 'hsla(38, 92%, 50%, 0.1)',
                    border: '1px solid var(--color-warning)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)'
                }}>
                    <div style={{ fontSize: '2rem' }}>⚠️</div>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>
                            {pendingCount} {t.users.waitingApproval}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {t.users.reviewPending}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                        onClick={() => setFilter('all')}
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {t.common.all} ({users.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {t.users.pending} ({users.filter(u => u.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {t.users.approved} ({users.filter(u => u.status === 'approved').length})
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {t.users.rejected} ({users.filter(u => u.status === 'rejected').length})
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t.auth.email}</th>
                            <th>{t.users.role}</th>
                            <th>{t.users.status}</th>
                            <th>{t.users.registeredAt}</th>
                            <th style={{ width: '200px' }}>{t.common.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                    <div style={{ color: 'var(--color-text-tertiary)' }}>
                                        {t.users.noUsers}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 600 }}>{user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            background: user.role === 'admin' ? 'hsla(280, 70%, 60%, 0.1)' : 'hsla(220, 15%, 88%, 0.5)',
                                            color: user.role === 'admin' ? 'var(--color-secondary)' : 'var(--color-text-secondary)'
                                        }}>
                                            {user.role === 'admin' ? t.users.admin : t.users.user}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            background:
                                                user.status === 'approved' ? 'hsla(142, 71%, 45%, 0.1)' :
                                                    user.status === 'pending' ? 'hsla(38, 92%, 50%, 0.1)' :
                                                        'hsla(0, 72%, 51%, 0.1)',
                                            color:
                                                user.status === 'approved' ? 'var(--color-success)' :
                                                    user.status === 'pending' ? 'var(--color-warning)' :
                                                        'var(--color-error)'
                                        }}>
                                            {user.status === 'approved' ? t.users.approved :
                                                user.status === 'pending' ? t.users.pending :
                                                    t.users.rejected}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        {user.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button
                                                    onClick={() => updateUserStatus(user.id, 'approved')}
                                                    className="btn btn-success"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    ✓ {t.users.approve}
                                                </button>
                                                <button
                                                    onClick={() => updateUserStatus(user.id, 'rejected')}
                                                    className="btn btn-error"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    ✗ {t.users.reject}
                                                </button>
                                            </div>
                                        )}
                                        {user.status === 'rejected' && (
                                            <button
                                                onClick={() => updateUserStatus(user.id, 'approved')}
                                                className="btn btn-success"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                ✓ {t.users.approve}
                                            </button>
                                        )}
                                        {user.status === 'approved' && user.role !== 'admin' && (
                                            <button
                                                onClick={() => updateUserStatus(user.id, 'rejected')}
                                                className="btn btn-error"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                ✗ {t.users.revoke}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
