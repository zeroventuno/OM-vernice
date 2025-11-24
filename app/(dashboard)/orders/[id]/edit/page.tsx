'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase, type Order } from '@/lib/supabase'
import OrderForm from '@/components/OrderForm'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EditOrderPage() {
    console.log('[EditOrderPage] Component is rendering! This should appear in console.')
    const { t } = useLanguage()
    const params = useParams()
    const orderId = params.id as string
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadOrder() {
            console.log('[EditOrderPage] Loading order:', orderId)
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single()

                console.log('[EditOrderPage] Supabase response:', { data, error })

                if (error) {
                    console.error('[EditOrderPage] Supabase error:', error)
                    throw error
                }

                if (!data) {
                    console.warn('[EditOrderPage] No data returned for order:', orderId)
                }

                setOrder(data)
            } catch (error: any) {
                console.error('[EditOrderPage] Error loading order:', error)
                console.error('[EditOrderPage] Error details:', {
                    message: error?.message,
                    details: error?.details,
                    hint: error?.hint,
                    code: error?.code
                })
                // Set order to null to show "not found" message
                setOrder(null)
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            loadOrder()
        }
    }, [orderId])

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

    if (!order) {
        return (
            <div>
                <h1>{t.orders.editOrderPage.notFound}</h1>
                <a href="/orders" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                    {t.orders.editOrderPage.backToOrders}
                </a>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>{t.orders.editOrderPage.title}</h1>
                <p className="text-muted">{t.orders.editOrderPage.subtitle} {order.ordem}</p>
            </div>

            <div className="card">
                <OrderForm initialData={order} isEdit={true} orderId={orderId} />
            </div>
        </div>
    )
}
