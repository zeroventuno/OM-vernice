'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { getModels, getAgents, getColors, TAMANHOS, ACABAMENTOS } from '@/lib/data'
import type { Order } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

type OrderFormProps = {
    initialData?: Partial<Order>
    isEdit?: boolean
    orderId?: string
    onSuccess?: () => void
}

export default function OrderForm({ initialData, isEdit = false, orderId, onSuccess }: OrderFormProps) {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Reference data
    const [models, setModels] = useState<string[]>([])
    const [agents, setAgents] = useState<string[]>([])
    const [colors, setColors] = useState<{ name: string, hex_code: string }[]>([])

    // Form data
    const [formData, setFormData] = useState({
        ordem: initialData?.ordem || '',
        matricula_quadro: initialData?.matricula_quadro || '',
        modelo: initialData?.modelo || '',
        tamanho: initialData?.tamanho || '',
        agente_comercial: initialData?.agente_comercial || '',
        catalogo_2026: initialData?.catalogo_2026 || false,
        cor_base: initialData?.cor_base || '',
        acabamento_base: initialData?.acabamento_base || 'Opaco',
        acabamento_base_rock: initialData?.acabamento_base_rock || false,
        cor_detalhes: initialData?.cor_detalhes || '',
        acabamento_detalhes: initialData?.acabamento_detalhes || 'Opaco',
        acabamento_detalhes_rock: initialData?.acabamento_detalhes_rock || false,
        cor_logo: initialData?.cor_logo || '',
        acabamento_logo: initialData?.acabamento_logo || 'Opaco',
        acabamento_logo_rock: initialData?.acabamento_logo_rock || false,
        cor_letras: initialData?.cor_letras || '',
        acabamento_letras: initialData?.acabamento_letras || 'Opaco',
        acabamento_letras_rock: initialData?.acabamento_letras_rock || false,
        pedidos_extras: initialData?.pedidos_extras || '',
        urgente: initialData?.urgente || false,
    })

    useEffect(() => {
        async function loadData() {
            console.log('[OrderForm] Loading reference data...')
            try {
                const [modelsData, agentsData, colorsData] = await Promise.all([
                    getModels(),
                    getAgents(),
                    getColors()
                ])

                console.log('[OrderForm] Models loaded:', modelsData)
                console.log('[OrderForm] Agents loaded:', agentsData)
                console.log('[OrderForm] Colors loaded:', colorsData)

                setModels(modelsData)
                setAgents(agentsData)
                setColors(colorsData as any)

                console.log('[OrderForm] State updated successfully')
            } catch (err) {
                console.error('[OrderForm] Error loading data:', err)
            }
        }
        loadData()
    }, [])

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const getColorHex = (colorName: string) => {
        const color = colors.find(c => c.name === colorName)
        return color?.hex_code || 'transparent'
    }

    const ColorPreview = ({ colorName }: { colorName: string }) => {
        const hex = getColorHex(colorName)
        if (!colorName || hex === 'transparent') return null
        return (
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: hex,
                border: '1px solid var(--color-border)',
                marginLeft: '8px',
                display: 'inline-block',
                verticalAlign: 'middle'
            }} title={hex} />
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { user } = await getCurrentUser()
            if (!user) throw new Error(t.auth.notAuthenticated)

            if (isEdit && orderId) {
                // Get old data for history tracking
                const { data: oldData } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single()

                // Update order - set status back to pending on edit
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({ ...formData, status: 'pending' })
                    .eq('id', orderId)

                if (updateError) throw updateError

                // Track changes
                if (oldData) {
                    await trackChanges(oldData, formData, orderId, user.id)
                }

                // Send modification email
                await sendEmailNotification(
                    { ...formData, ordem: oldData.ordem }, // Ensure we have the order number
                    user.email,
                    `Ordem (#${oldData.ordem}) foi modificada`
                )
            } else {
                // Create new order - default status is pending
                const { data, error: insertError } = await supabase
                    .from('orders')
                    .insert([{ ...formData, created_by: user.id, status: 'pending' }])
                    .select()
                    .single()

                if (insertError) throw insertError

                // Track initial creation
                await trackInitialCreation(data.id, user.id, user.email)

                // Send email notification
                await sendEmailNotification(formData, user.email)
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/orders')
            }
        } catch (err: any) {
            setError(err.message || t.orders.saveError)
        } finally {
            setLoading(false)
        }
    }

    async function trackChanges(oldData: any, newData: any, orderId: string, userId: string) {
        const changes = []

        for (const key in newData) {
            if (oldData[key] !== newData[key]) {
                changes.push({
                    order_id: orderId,
                    field_name: key,
                    old_value: String(oldData[key] || ''),
                    new_value: String(newData[key] || ''),
                    edited_by: userId
                })
            }
        }

        if (changes.length > 0) {
            await supabase.from('edit_history').insert(changes)
        }
    }

    async function trackInitialCreation(orderId: string, userId: string, userEmail: string) {
        await supabase.from('edit_history').insert([{
            order_id: orderId,
            field_name: 'created',
            old_value: '',
            new_value: `Pedido criado por ${userEmail}`,
            edited_by: userId
        }])
    }

    async function sendEmailNotification(data: any, userEmail: string, subject?: string) {
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderData: data,
                    userEmail,
                    subject
                }),
            })
        } catch (err) {
            console.error('Error sending email:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'hsla(0, 72%, 51%, 0.1)',
                    border: '1px solid var(--color-error)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-error)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                {/* Ordem */}
                <div className="form-group">
                    <label className="form-label">{t.orders.orderNumber} *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.ordem}
                        onChange={(e) => handleChange('ordem', e.target.value)}
                        required
                    />
                </div>

                {/* Matrícula do Quadro */}
                <div className="form-group">
                    <label className="form-label">{t.orders.frameNumber} *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.matricula_quadro}
                        onChange={(e) => handleChange('matricula_quadro', e.target.value)}
                        required
                    />
                </div>

                {/* Modelo */}
                <div className="form-group">
                    <label className="form-label">{t.orders.model} *</label>
                    <select
                        className="form-select"
                        value={formData.modelo}
                        onChange={(e) => handleChange('modelo', e.target.value)}
                        required
                    >
                        <option value="">{t.common.selectOption}</option>
                        {models.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                {/* Tamanho */}
                <div className="form-group">
                    <label className="form-label">{t.orders.size} *</label>
                    <select
                        className="form-select"
                        value={formData.tamanho}
                        onChange={(e) => handleChange('tamanho', e.target.value)}
                        required
                    >
                        <option value="">{t.common.selectOption}</option>
                        {TAMANHOS.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                {/* Agente Comercial */}
                <div className="form-group">
                    <label className="form-label">{t.orders.agent} *</label>
                    <select
                        className="form-select"
                        value={formData.agente_comercial}
                        onChange={(e) => handleChange('agente_comercial', e.target.value)}
                        required
                    >
                        <option value="">{t.common.selectOption}</option>
                        {agents.map(agent => (
                            <option key={agent} value={agent}>{agent}</option>
                        ))}
                    </select>
                </div>

                {/* Catálogo 2026 */}
                <div className="form-group">
                    <div style={{ paddingTop: '2rem' }}>
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.catalogo_2026}
                                onChange={(e) => handleChange('catalogo_2026', e.target.checked)}
                            />
                            <span>{t.orders.catalog2026}</span>
                        </label>
                    </div>
                </div>

                {/* Urgente */}
                <div className="form-group">
                    <div style={{ paddingTop: '2rem' }}>
                        <label className="form-checkbox" style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>
                            <input
                                type="checkbox"
                                checked={formData.urgente}
                                onChange={(e) => handleChange('urgente', e.target.checked)}
                            />
                            <span>Urgente / Prioridade Alta</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Cor Base Section */}
            <div style={{
                marginTop: 'var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>{t.orders.baseColor}</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div className="form-group">
                        <label className="form-label">
                            {t.orders.baseColor} *
                            <ColorPreview colorName={formData.cor_base} />
                        </label>
                        <select
                            className="form-select"
                            value={formData.cor_base}
                            onChange={(e) => handleChange('cor_base', e.target.value)}
                            required
                        >
                            <option value="">{t.common.selectOption}</option>
                            {colors.map(color => (
                                <option key={color.name} value={color.name}>{color.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t.orders.baseFinish} *</label>
                        <select
                            className="form-select"
                            value={formData.acabamento_base}
                            onChange={(e) => handleChange('acabamento_base', e.target.value)}
                            required
                        >
                            {ACABAMENTOS.map(acabamento => (
                                <option key={acabamento} value={acabamento}>{acabamento}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <div style={{ paddingTop: '2rem' }}>
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acabamento_base_rock}
                                    onChange={(e) => handleChange('acabamento_base_rock', e.target.checked)}
                                />
                                <span>{t.orders.rock}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalhes Section */}
            <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>{t.orders.detailsColor}</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div className="form-group">
                        <label className="form-label">
                            {t.orders.detailsColor} *
                            <ColorPreview colorName={formData.cor_detalhes} />
                        </label>
                        <select
                            className="form-select"
                            value={formData.cor_detalhes}
                            onChange={(e) => handleChange('cor_detalhes', e.target.value)}
                            required
                        >
                            <option value="">{t.common.selectOption}</option>
                            {colors.map(color => (
                                <option key={color.name} value={color.name}>{color.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t.orders.detailsFinish} *</label>
                        <select
                            className="form-select"
                            value={formData.acabamento_detalhes}
                            onChange={(e) => handleChange('acabamento_detalhes', e.target.value)}
                            required
                        >
                            {ACABAMENTOS.map(acabamento => (
                                <option key={acabamento} value={acabamento}>{acabamento}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <div style={{ paddingTop: '2rem' }}>
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acabamento_detalhes_rock}
                                    onChange={(e) => handleChange('acabamento_detalhes_rock', e.target.checked)}
                                />
                                <span>{t.orders.rock}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo Section */}
            <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>{t.orders.logoColor}</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div className="form-group">
                        <label className="form-label">
                            {t.orders.logoColor} *
                            <ColorPreview colorName={formData.cor_logo} />
                        </label>
                        <select
                            className="form-select"
                            value={formData.cor_logo}
                            onChange={(e) => handleChange('cor_logo', e.target.value)}
                            required
                        >
                            <option value="">{t.common.selectOption}</option>
                            {colors.map(color => (
                                <option key={color.name} value={color.name}>{color.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t.orders.logoFinish} *</label>
                        <select
                            className="form-select"
                            value={formData.acabamento_logo}
                            onChange={(e) => handleChange('acabamento_logo', e.target.value)}
                            required
                        >
                            {ACABAMENTOS.map(acabamento => (
                                <option key={acabamento} value={acabamento}>{acabamento}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <div style={{ paddingTop: '2rem' }}>
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acabamento_logo_rock}
                                    onChange={(e) => handleChange('acabamento_logo_rock', e.target.checked)}
                                />
                                <span>{t.orders.rock}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Letras Section */}
            <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>{t.orders.lettersColor}</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div className="form-group">
                        <label className="form-label">
                            {t.orders.lettersColor} *
                            <ColorPreview colorName={formData.cor_letras} />
                        </label>
                        <select
                            className="form-select"
                            value={formData.cor_letras}
                            onChange={(e) => handleChange('cor_letras', e.target.value)}
                            required
                        >
                            <option value="">{t.common.selectOption}</option>
                            {colors.map(color => (
                                <option key={color.name} value={color.name}>{color.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t.orders.lettersFinish} *</label>
                        <select
                            className="form-select"
                            value={formData.acabamento_letras}
                            onChange={(e) => handleChange('acabamento_letras', e.target.value)}
                            required
                        >
                            {ACABAMENTOS.map(acabamento => (
                                <option key={acabamento} value={acabamento}>{acabamento}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <div style={{ paddingTop: '2rem' }}>
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acabamento_letras_rock}
                                    onChange={(e) => handleChange('acabamento_letras_rock', e.target.checked)}
                                />
                                <span>{t.orders.rock}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pedidos Extras */}
            <div className="form-group" style={{ marginTop: 'var(--spacing-xl)' }}>
                <label className="form-label">{t.orders.extraRequests}</label>
                <textarea
                    className="form-textarea"
                    value={formData.pedidos_extras}
                    onChange={(e) => handleChange('pedidos_extras', e.target.value)}
                    placeholder={t.orders.extraPlaceholder}
                />
            </div>

            {/* Actions */}
            <div style={{
                marginTop: 'var(--spacing-2xl)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'flex-end'
            }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    {t.common.cancel}
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="spinner" style={{ width: '1.25rem', height: '1.25rem' }}></span>
                    ) : (
                        isEdit ? t.orders.updateOrder : t.orders.createOrder
                    )}
                </button>
            </div>
        </form>
    )
}
