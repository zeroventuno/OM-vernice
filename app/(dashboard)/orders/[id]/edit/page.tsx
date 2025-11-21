'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase, type Order } from '@/lib/supabase'
import OrderForm from '@/components/OrderForm'

export default function EditOrderPage() {
    const params = useParams()
    const orderId = params.id as string
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadOrder() {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single()

                if (error) throw error
                setOrder(data)
            } catch (error) {
                console.error('Error loading order:', error)
            } finally {
                setLoading(false)
            }
        }

        loadOrder()
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
                <h1>Pedido não encontrado</h1>
                <a href="/orders" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                    Voltar para Pedidos
                </a>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Editar Pedido</h1>
                <p className="text-muted">Atualize os dados do pedido {order.ordem}</p>
            </div>

            <div className="card">
                <OrderForm initialData={order} isEdit={true} orderId={orderId} />
            </div>
        </div>
    )
}
