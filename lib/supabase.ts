import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
    id: string
    email: string
    role: 'admin' | 'user'
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
}

export type Order = {
    id: string
    ordem: string
    matricula_quadro: string
    modelo: string
    tamanho: string
    agente_comercial: string
    catalogo_2026: boolean
    cor_base: string
    acabamento_base: string
    acabamento_base_rock: boolean
    cor_detalhes: string
    acabamento_detalhes: string
    acabamento_detalhes_rock: boolean
    cor_logo: string
    acabamento_logo: string
    acabamento_logo_rock: boolean
    cor_letras: string
    acabamento_letras: string
    acabamento_letras_rock: boolean
    pedidos_extras: string
    created_by: string
    created_at: string
    updated_at: string
    status: 'pending' | 'completed'
}

export type EditHistory = {
    id: string
    order_id: string
    field_name: string
    old_value: string
    new_value: string
    edited_by: string
    edited_at: string
    user?: {
        email: string
    }
}
