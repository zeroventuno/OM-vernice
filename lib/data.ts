import { supabase } from './supabase'

export const TAMANHOS = ['48', '50', '52', '54', '56', '58', '60', '63', 'XS', 'S', 'M', 'L', 'XL', 'CUSTOM']
export const ACABAMENTOS = ['Opaco', 'Brilhoso']

export async function getModels() {
    const { data, error } = await supabase
        .from('models')
        .select('name')
        .order('name')

    if (error) {
        console.error('Error fetching models:', error)
        return []
    }

    return data.map(m => m.name)
}

export async function getAgents() {
    const { data, error } = await supabase
        .from('agents')
        .select('name')
        .order('name')

    if (error) {
        console.error('Error fetching agents:', error)
        return []
    }

    return data.map(a => a.name)
}

export async function getColors() {
    const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true }) // Fallback to alphabetical if display_order is same

    if (error) {
        console.error('Error fetching colors:', error)
        return []
    }
    return data
}
