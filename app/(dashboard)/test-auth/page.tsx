'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export default function TestAuthPage() {
    const [results, setResults] = useState<any>({
        envVars: null,
        supabaseConnection: null,
        currentUser: null,
        loading: true
    })

    useEffect(() => {
        async function runTests() {
            const testResults: any = {
                loading: false
            }

            // Test 1: Environment Variables
            testResults.envVars = {
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ NÃO ENCONTRADA',
                supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
                supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ NÃO ENCONTRADA',
                supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
            }

            // Test 2: Supabase Connection
            try {
                const { data, error } = await supabase.from('users').select('count').limit(1)
                testResults.supabaseConnection = {
                    status: error ? '❌ ERRO' : '✅ Conectado',
                    error: error?.message || null,
                    data: data
                }
            } catch (err: any) {
                testResults.supabaseConnection = {
                    status: '❌ ERRO',
                    error: err.message
                }
            }

            // Test 3: Current User
            try {
                const { user, error } = await getCurrentUser()
                testResults.currentUser = {
                    status: user ? '✅ Autenticado' : '❌ Não autenticado',
                    email: user?.email || null,
                    userStatus: user?.status || null,
                    role: user?.role || null,
                    error: error?.message || null
                }
            } catch (err: any) {
                testResults.currentUser = {
                    status: '❌ ERRO',
                    error: err.message
                }
            }

            // Test 4: Auth Session
            try {
                const { data: { session } } = await supabase.auth.getSession()
                testResults.authSession = {
                    status: session ? '✅ Sessão ativa' : '❌ Sem sessão',
                    expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null
                }
            } catch (err: any) {
                testResults.authSession = {
                    status: '❌ ERRO',
                    error: err.message
                }
            }

            setResults(testResults)
        }

        runTests()
    }, [])

    if (results.loading) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <h1>🔍 Testando configurações...</h1>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '800px' }}>
            <h1>🔍 Diagnóstico de Configuração - Vercel</h1>

            <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
                <h2>1️⃣ Variáveis de Ambiente</h2>
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {results.envVars.supabaseUrl}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>Valor: {results.envVars.supabaseUrlValue}</p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {results.envVars.supabaseKey}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>Tamanho: {results.envVars.supabaseKeyLength} caracteres</p>
                </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h2>2️⃣ Conexão com Supabase</h2>
                <p><strong>Status:</strong> {results.supabaseConnection.status}</p>
                {results.supabaseConnection.error && (
                    <p style={{ color: 'red', fontSize: '0.875rem' }}>
                        <strong>Erro:</strong> {results.supabaseConnection.error}
                    </p>
                )}
            </div>

            <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h2>3️⃣ Sessão de Autenticação</h2>
                <p><strong>Status:</strong> {results.authSession.status}</p>
                {results.authSession.expiresAt && (
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                        <strong>Expira em:</strong> {results.authSession.expiresAt}
                    </p>
                )}
                {results.authSession.error && (
                    <p style={{ color: 'red', fontSize: '0.875rem' }}>
                        <strong>Erro:</strong> {results.authSession.error}
                    </p>
                )}
            </div>

            <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h2>4️⃣ Usuário Atual</h2>
                <p><strong>Status:</strong> {results.currentUser.status}</p>
                {results.currentUser.email && (
                    <>
                        <p><strong>Email:</strong> {results.currentUser.email}</p>
                        <p><strong>Status do Usuário:</strong> {results.currentUser.userStatus}</p>
                        <p><strong>Role:</strong> {results.currentUser.role}</p>
                    </>
                )}
                {results.currentUser.error && (
                    <p style={{ color: 'red', fontSize: '0.875rem' }}>
                        <strong>Erro:</strong> {results.currentUser.error}
                    </p>
                )}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                <h3>⚠️ Como Interpretar:</h3>
                <ul style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <li>Se as <strong>variáveis de ambiente</strong> não aparecerem: configure no Vercel</li>
                    <li>Se a <strong>conexão com Supabase</strong> falhar: verifique as credenciais</li>
                    <li>Se a <strong>sessão</strong> não existir: faça login novamente</li>
                    <li>Se o <strong>usuário</strong> não carregar: verifique as políticas RLS do Supabase</li>
                </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <a href="/orders" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    ← Voltar para Pedidos
                </a>
            </div>
        </div>
    )
}
