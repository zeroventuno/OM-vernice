'use client'

import { useState, useEffect } from 'react'
import { supabase, type Order } from '@/lib/supabase'
import OrderForm from '@/components/OrderForm'
import { useLanguage } from '@/contexts/LanguageContext'
import { X } from 'lucide-react'

interface EditModalProps {
    orderId: string
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function EditModal({ orderId, isOpen, onClose, onSuccess }: EditModalProps) {
    const { t } = useLanguage()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && orderId) {
            loadOrder()
        }
    }, [isOpen, orderId])

    async function loadOrder() {
        console.log('[EditModal] Loading order:', orderId)
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single()

            if (error) {
                console.error('[EditModal] Error loading order:', error)
                throw error
            }

            console.log('[EditModal] Order loaded successfully')
            setOrder(data)
        } catch (error) {
            console.error('[EditModal] Failed to load order:', error)
            setOrder(null)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 'var(--spacing-lg)'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    background: 'white',
                    borderBottom: '1px solid var(--color-border)',
                    padding: 'var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{t.orders.editOrderPage.title}</h2>
                        {order && (
                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-muted)' }}>
                                {t.orders.editOrderPage.subtitle} {order.ordem}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title={t.orders.editHistory.close}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--spacing-xl)' }}>
                    {loading && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px'
                        }}>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {!loading && !order && (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            <h3>{t.orders.editOrderPage.notFound}</h3>
                            <button
                                onClick={onClose}
                                className="btn btn-primary"
                                style={{ marginTop: 'var(--spacing-lg)' }}
                            >
                                {t.orders.editHistory.close}
                            </button>
                        </div>
                    )}

                    {!loading && order && (
                        <OrderForm
                            initialData={order}
                            isEdit={true}
                            orderId={orderId}
                            onSuccess={() => {
                                if (onSuccess) onSuccess()
                                onClose()
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
