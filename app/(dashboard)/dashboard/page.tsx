'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, Clock, CheckCircle2, ClipboardList } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPage() {
    const { t } = useLanguage()
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        recentOrders: [] as any[]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                // Get total orders
                const { count: totalOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })

                // Get pending orders
                const { count: pendingOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')

                // Get completed orders
                const { count: completedOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'completed')

                // Get recent orders
                const { data: recentOrders } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5)

                setStats({
                    totalOrders: totalOrders || 0,
                    pendingOrders: pendingOrders || 0,
                    completedOrders: completedOrders || 0,
                    recentOrders: recentOrders || []
                })
            } catch (error) {
                console.error('Error loading stats:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [])

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
                <h1>{t.dashboard.title}</h1>
                <p className="text-muted">{t.dashboard.subtitle}</p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{
                        marginBottom: 'var(--spacing-sm)',
                        opacity: 0.7,
                        color: 'var(--color-text)'
                    }}>
                        <BarChart3 size={32} />
                    </div>
                    <div style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {stats.totalOrders}
                    </div>
                    <div style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                    }}>
                        {t.dashboard.totalOrders}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{
                        marginBottom: 'var(--spacing-sm)',
                        opacity: 0.7,
                        color: 'var(--color-warning)'
                    }}>
                        <Clock size={32} />
                    </div>
                    <div style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'var(--color-warning)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {stats.pendingOrders}
                    </div>
                    <div style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                    }}>
                        {t.dashboard.pendingOrders}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{
                        marginBottom: 'var(--spacing-sm)',
                        opacity: 0.7,
                        color: 'var(--color-success)'
                    }}>
                        <CheckCircle2 size={32} />
                    </div>
                    <div style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {stats.completedOrders}
                    </div>
                    <div style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                    }}>
                        {t.dashboard.completedOrders}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{t.dashboard.recentOrders}</h3>
                </div>
                {stats.recentOrders.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
                            <ClipboardList size={48} />
                        </div>
                        <p>{t.orders.noOrders}</p>
                        <a href="/orders/new" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                            {t.orders.createFirst}
                        </a>
                    </div>
                ) : (
                    <div className="table-container" style={{ boxShadow: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t.orders.orderNumber}</th>
                                    <th>{t.orders.model}</th>
                                    <th>{t.orders.baseColor}</th>
                                    <th>{t.orders.agent}</th>
                                    <th>{t.common.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 600 }}>{order.ordem}</td>
                                        <td>{order.modelo}</td>
                                        <td>{order.cor_base}</td>
                                        <td>{order.agente_comercial}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
