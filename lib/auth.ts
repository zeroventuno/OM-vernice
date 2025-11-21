import { supabase } from './supabase'

const ALLOWED_DOMAIN = '@officinemattio.com'

export async function signUp(email: string, password: string) {
    // Validate email domain
    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return {
            error: {
                message: `Apenas emails com domínio ${ALLOWED_DOMAIN} são permitidos.`
            }
        }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                email,
            }
        }
    })

    if (error) return { error }

    return { data }
}

export async function signIn(email: string, password: string) {
    // Validate email domain
    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return {
            error: {
                message: `Apenas emails com domínio ${ALLOWED_DOMAIN} são permitidos.`
            }
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) return { error }

    // Check if user is approved
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('status, role')
        .eq('id', data.user.id)
        .single()

    if (userError) {
        await supabase.auth.signOut()
        return { error: { message: 'Erro ao verificar status do usuário.' } }
    }

    if (userData.status !== 'approved') {
        await supabase.auth.signOut()
        return {
            error: {
                message: userData.status === 'pending'
                    ? 'Sua conta está pendente de aprovação. Aguarde a aprovação de um administrador.'
                    : 'Sua conta foi rejeitada. Entre em contato com o administrador.'
            }
        }
    }

    return { data: { ...data, user: { ...data.user, role: userData.role } } }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return { user: null, error }

    // Get user profile data
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (userError) return { user: null, error: userError }

    return { user: { ...user, ...userData }, error: null }
}

export async function checkUserApproval(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('status, role')
        .eq('id', userId)
        .single()

    if (error) return { approved: false, error }

    return {
        approved: data.status === 'approved',
        role: data.role,
        status: data.status,
        error: null
    }
}
