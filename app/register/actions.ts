'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type ProductInput = {
    productType: string
    model: string
    customModel?: string
    serialNumber: string
    notes?: string
}

export type RegistrationFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    products: ProductInput[]
}

export async function submitRegistration(data: RegistrationFormData) {
    try {
        // 1. Insert Customer
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                zip_code: data.zipCode,
                country: data.country
            })
            .select()
            .single()

        if (customerError) {
            console.error('Error inserting customer:', customerError)
            return { success: false, error: customerError.message }
        }

        // 2. Insert Products
        const productsToInsert = data.products.map(product => ({
            customer_id: customer.id,
            product_type: product.productType,
            model: product.model === 'Other' ? product.customModel || 'Other' : product.model,
            custom_model: product.model === 'Other' ? product.customModel : null,
            serial_number: product.serialNumber,
            notes: product.notes
        }))

        const { error: productsError } = await supabase
            .from('customer_products')
            .insert(productsToInsert)

        if (productsError) {
            console.error('Error inserting products:', productsError)
            // Ideally we might want to rollback customer creation here, but Supabase doesn't support transactions via JS client easily without RPC.
            // For this simple app, we'll just report the error.
            return { success: false, error: productsError.message }
        }

        return { success: true }

    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
