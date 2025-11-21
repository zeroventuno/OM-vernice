'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DirectEditTest() {
    const router = useRouter()
    const [logs, setLogs] = useState<string[]>([])
    const [testComplete, setTestComplete] = useState(false)

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`])
        console.log(message)
    }

    useEffect(() => {
        async function runTest() {
            addLog('🚀 Iniciando teste de autenticação...')

            // Test 1: Check session
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                addLog(`📋 Sessão: ${session ? '✅ Ativa' : '❌ Nenhuma'}`)
                if (sessionError) {
                    addLog(`❌ Erro ao pegar sessão: ${sessionError.message}`)
                }
                if (session) {
                    addLog(`👤 User ID: ${session.user.id}`)
                    addLog(`📧 Email: ${session.user.email}`)
                    addLog(`⏰ Expira em: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
                }
            } catch (err: any) {
                addLog(`❌ Erro inesperado na sessão: ${err.message}`)
            }

            // Test 2: Try to get user from users table
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    addLog(`🔍 Buscando dados do usuário na tabela users...`)
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (userError) {
                        addLog(`❌ Erro ao buscar usuário: ${userError.message}`)
                        addLog(`   Code: ${userError.code}`)
                        addLog(`   Details: ${userError.details}`)
                        addLog(`   Hint: ${userError.hint}`)
                    } else if (userData) {
                        addLog(`✅ Usuário encontrado:`)
                        addLog(`   Email: ${userData.email}`)
                        addLog(`   Role: ${userData.role}`)
                        addLog(`   Status: ${userData.status}`)
                    } else {
                        addLog(`⚠️ Usuário não encontrado na tabela users`)
                    }
                }
            } catch (err: any) {
                addLog(`❌ Erro ao buscar usuário: ${err.message}`)
            }

            // Test 3: Try to get an order
            try {
                addLog(`📦 Testando acesso à tabela orders...`)
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('id, ordem')
                    .limit(1)

                if (ordersError) {
                    addLog(`❌ Erro ao buscar pedidos: ${ordersError.message}`)
                    addLog(`   Code: ${ordersError.code}`)
                    addLog(`   Details: ${ordersError.details}`)
                    addLog(`   Hint: ${ordersError.hint}`)
                } else if (orders && orders.length > 0) {
                    addLog(`✅ Acesso a pedidos OK - Encontrado pedido: ${orders[0].ordem}`)
                } else {
                    addLog(`⚠️ Nenhum pedido encontrado (mas sem erro)`)
                }
            } catch (err: any) {
                addLog(`❌ Erro ao buscar pedidos: ${err.message}`)
            }

            // Test 4: Check environment variables
            addLog(`🔧 Verificando variáveis de ambiente...`)
            addLog(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ OK' : '❌ MISSING'}`)
            addLog(`NEXT_PUBLIC_SUPABASE_ANON_KEY length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0}`)

            addLog(`✅ Teste completo!`)
            setTestComplete(true)
        }

        runTest()
    }, [])

    return (
        <div style={{
            padding: '2rem',
            fontFamily: 'monospace',
            maxWidth: '900px',
            margin: '0 auto'
        }}>
            <h1>🔍 Teste Direto de Autenticação (Sem Dashboard Layout)</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Esta página NÃO usa o layout do dashboard, então vamos ver se o problema é na verificação de auth do layout.
            </p>

            <div style={{
                background: '#000',
                color: '#0f0',
                padding: '1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                height: '500px',
                overflowY: 'auto',
                fontFamily: 'Courier New, monospace'
            }}>
                {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>{log}</div>
                ))}
            </div>

            {testComplete && (
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => router.push('/orders')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Ir para Pedidos (com layout)
                    </button>
                    <button
                        onClick={() => router.push('/auth/login')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Ir para Login
                    </button>
                </div>
            )}
        </div>
    )
}
