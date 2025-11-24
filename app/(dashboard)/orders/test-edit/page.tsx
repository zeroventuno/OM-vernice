export default function TestEditRoute() {
    console.log('[TEST ROUTE] Page is rendering!')

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🧪 Test Edit Route</h1>
            <p>Se você está vendo esta página, a rota de edição funciona!</p>
            <p>Verifique o console - deve aparecer: [TEST ROUTE] Page is rendering!</p>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Resultado:</h3>
                <p style={{ color: 'green', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    ✅ ROTA ESTÁ FUNCIONANDO
                </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <a href="/orders" style={{ color: 'blue', textDecoration: 'underline' }}>
                    ← Voltar para Pedidos
                </a>
            </div>
        </div>
    )
}
