'use client'

import OrderForm from '@/components/OrderForm'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NewOrderPage() {
    const { t } = useLanguage()

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>{t.orders.newOrder}</h1>
                <p className="text-muted">{t.orders.newOrderSubtitle}</p>
            </div>

            <div className="card">
                <OrderForm />
            </div>
        </div>
    )
}
