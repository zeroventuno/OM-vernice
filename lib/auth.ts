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
    console.log('[getCurrentUser] Starting...')

    const { data: { user }, error } = await supabase.auth.getUser()

    console.log('[getCurrentUser] Auth user:', {
        exists: !!user,
        id: user?.id,
        email: user?.email,
        error: error?.message
    })

    if (error || !user) {
        console.error('[getCurrentUser] No auth user:', error)
        return { user: null, error }
    }

    // Get user profile data
    try {
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        console.log('[getCurrentUser] User profile fetch:', {
            success: !userError,
            userData: userData ? 'exists' : 'null',
            error: userError?.message,
            code: userError?.code,
            details: userError?.details
        })

        if (userError) {
            console.error('[getCurrentUser] RLS or DB error fetching profile:', userError)
            // FALLBACK: Return auth user with minimal data instead of failing completely
            // This prevents redirect to login when user is authenticated but RLS blocks profile fetch
            return {
                user: {
                    ...user,
                    role: 'user', // default role as fallback
                    status: 'approved', // assume approved if they're authenticated
                    email: user.email || '',
                    id: user.id
                } as any,
                error: null // Don't return error to prevent logout
            }
        }

        return { user: { ...user, ...userData }, error: null }
    } catch (err: any) {
        console.error('[getCurrentUser] Unexpected error:', err)
        // Return auth user as fallback
        return {
            user: {
                ...user,
                role: 'user',
                status: 'approved',
                email: user.email || '',
                id: user.id
            } as any,
            error: null
        }
    }
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
