'use client'

import { useParams } from 'next/navigation'

export default function TestDynamicRoute() {
    const params = useParams()
    console.log('[TEST DYNAMIC] Rendering with params:', params)

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🧪 Test Dynamic Route</h1>
            <p>ID recebido: <strong>{params.testid as string}</strong></p>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Console:</h3>
                <p>Veja o console - deve aparecer: [TEST DYNAMIC] Rendering with params</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <a href="/orders" style={{ color: 'blue', textDecoration: 'underline' }}>
                    ← Voltar para Pedidos
                </a>
            </div>
        </div>
    )
}
