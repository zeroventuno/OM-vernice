'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { LayoutDashboard, ClipboardList, PlusCircle, Settings, LogOut, KeyRound } from 'lucide-react'
import ChangePasswordModal from './ChangePasswordModal'

type SidebarProps = {
    userEmail?: string
    userRole?: string
}

export default function Sidebar({ userEmail, userRole }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language, setLanguage, t } = useLanguage()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const handleSignOut = async () => {
        setLoading(true)
        await signOut()
        router.push('/auth/login')
    }

    const navItems = [
        { href: '/dashboard', label: t.dashboard.title, icon: <LayoutDashboard size={20} /> },
        { href: '/orders', label: t.orders.title, icon: <ClipboardList size={20} /> },
        { href: '/orders/new', label: t.orders.newOrder, icon: <PlusCircle size={20} /> },
    ]

    if (userRole === 'admin') {
        navItems.push({ href: '/admin/users', label: t.users.title, icon: <Settings size={20} /> })
    }

    // Get first letter of email for avatar
    const userInitial = userEmail?.charAt(0).toUpperCase() || 'U'

    // ...

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            background: 'white',
            borderRight: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 50
        }}>
            {/* Logo */}
            <div style={{
                padding: 'var(--spacing-xl) var(--spacing-lg)',
                borderBottom: '1px solid var(--color-border-light)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Image
                    src="/logo.png"
                    alt="Officine Mattio"
                    width={180}
                    height={60}
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>

            {/* Navigation */}
            <nav style={{
                flex: 1,
                padding: 'var(--spacing-lg)',
                paddingTop: 'var(--spacing-xl)'
            }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md) var(--spacing-lg)',
                                marginBottom: 'var(--spacing-xs)',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                                background: isActive ? 'hsla(0, 0%, 20%, 0.08)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all var(--transition-base)',
                                fontSize: '0.8125rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'var(--color-bg-secondary)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent'
                                }
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                            {item.label}
                        </a>
                    )
                })}
            </nav>

            {/* Language Selector */}
            <div style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center'
            }}>
                <button
                    onClick={() => setLanguage('pt-BR')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer',
                        opacity: language === 'pt-BR' ? 1 : 0.4,
                        transition: 'opacity 0.2s',
                        filter: language === 'pt-BR' ? 'none' : 'grayscale(100%)'
                    }}
                    title="Português"
                >
                    <span style={{ fontSize: '1.5rem', display: 'block' }}>🇧🇷</span>
                </button>
                <button
                    onClick={() => setLanguage('it')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer',
                        opacity: language === 'it' ? 1 : 0.4,
                        transition: 'opacity 0.2s',
                        filter: language === 'it' ? 'none' : 'grayscale(100%)'
                    }}
                    title="Italiano"
                >
                    <span style={{ fontSize: '1.5rem', display: 'block' }}>🇮🇹</span>
                </button>
            </div>

            {/* User Info */}
            <div style={{ position: 'relative' }}>
                {showUserMenu && (
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 90
                            }}
                            onClick={() => setShowUserMenu(false)}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 'var(--spacing-lg)',
                            right: 'var(--spacing-lg)',
                            background: 'white',
                            border: '1px solid var(--color-border-light)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            marginBottom: 'var(--spacing-xs)',
                            zIndex: 100,
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => {
                                    setShowUserMenu(false)
                                    setShowPasswordModal(true)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    color: 'var(--color-text)',
                                    fontSize: '0.875rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <KeyRound size={16} />
                                {language === 'pt-BR' ? 'Alterar Senha' : 'Cambia Password'}
                            </button>
                        </div>
                    </>
                )}

                <div style={{
                    padding: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--color-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)'
                }}>
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            flex: 1,
                            minWidth: 0,
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'hsla(280, 70%, 60%, 0.15)',
                            color: 'hsl(280, 70%, 50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1rem',
                            flexShrink: 0
                        }}>
                            {userInitial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                color: 'var(--color-text)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {userEmail?.split('@')[0] || 'Utente'}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-tertiary)'
                            }}>
                                {userRole === 'admin' ? t.users.admin : t.users.user}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="btn"
                        style={{
                            background: 'transparent',
                            color: 'var(--color-text-tertiary)',
                            border: 'none',
                            padding: 'var(--spacing-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'color var(--transition-base)'
                        }}
                        title={t.auth.logout}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-tertiary)' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </aside>
    )
}
