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
            const { user, error } = await getCurrentUser()

            if (error || !user) {
                router.push('/auth/login')
                return
            }

            if (user.status !== 'approved') {
                router.push('/auth/login')
                return
            }

            setUser(user)
            setLoading(false)
        }

        checkAuth()
    }, [router])

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
