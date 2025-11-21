'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAuth() {
            try {
                const { user, error } = await getCurrentUser()

                if (error || !user) {
                    console.error('Auth error:', error)
                    router.push('/auth/login')
                    return
                }

                if (user.status !== 'approved') {
                    console.warn('User not approved:', user.status)
                    router.push('/auth/login')
                    return
                }

                setUser(user)
                setLoading(false)
            } catch (err) {
                console.error('Unexpected auth error:', err)
                router.push('/auth/login')
            }
        }

        checkAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Only run once on mount, not on every navigation

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <LanguageProvider>
            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <Sidebar userEmail={user?.email} userRole={user?.role} />
                <main style={{
                    marginLeft: '280px',
                    flex: 1,
                    padding: 'var(--spacing-xl)',
                    background: 'var(--color-bg)',
                    overflowY: 'auto',
                    height: '100vh'
                }}>
                    {children}
                </main>
            </div>
        </LanguageProvider>
    )
}
