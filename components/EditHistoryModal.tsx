import { useLanguage } from '@/contexts/LanguageContext'
import { EditHistory } from '@/lib/supabase'

type EditHistoryModalProps = {
    orderId: string
    history: EditHistory[]
    onClose: () => void
}

// Simple date formatter without date-fns locales to avoid Vercel bundling issues
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${day}/${month}/${year} às ${hours}:${minutes}`
    } catch (e) {
        return dateString
    }
}

export default function EditHistoryModal({ orderId, history, onClose }: EditHistoryModalProps) {
    const { t, language } = useLanguage()

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: '800px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 style={{ margin: 0 }}>{t.orders.editHistory.title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            padding: '0',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {history.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            color: 'var(--color-text-tertiary)'
                        }}>
                            <p>{t.orders.editHistory.empty}</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {history.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: 'var(--spacing-lg)',
                                        borderBottom: index < history.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                        transition: 'background var(--transition-fast)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 'var(--spacing-sm)'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontWeight: 600,
                                                color: 'var(--color-text)',
                                                marginBottom: 'var(--spacing-xs)'
                                            }}>
                                                {t.orders.editHistory.fields[item.field_name as keyof typeof t.orders.editHistory.fields] || item.field_name}
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {item.user?.email || t.orders.editHistory.unknownUser}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-text-tertiary)',
                                            textAlign: 'right'
                                        }}>
                                            {formatDate(item.edited_at)}
                                        </div>
                                    </div>

                                    {item.field_name !== 'created' && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr auto 1fr',
                                            gap: 'var(--spacing-md)',
                                            alignItems: 'center',
                                            marginTop: 'var(--spacing-md)'
                                        }}>
                                            <div style={{
                                                padding: 'var(--spacing-sm)',
                                                background: 'hsla(0, 72%, 51%, 0.1)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-error)',
                                                    fontWeight: 600,
                                                    marginBottom: 'var(--spacing-xs)'
                                                }}>
                                                    {t.orders.editHistory.previous}
                                                </div>
                                                {item.old_value || t.orders.editHistory.emptyValue}
                                            </div>
                                            <div style={{ color: 'var(--color-text-tertiary)' }}>→</div>
                                            <div style={{
                                                padding: 'var(--spacing-sm)',
                                                background: 'hsla(142, 71%, 45%, 0.1)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-success)',
                                                    fontWeight: 600,
                                                    marginBottom: 'var(--spacing-xs)'
                                                }}>
                                                    {t.orders.editHistory.new}
                                                </div>
                                                {item.new_value || t.orders.editHistory.emptyValue}
                                            </div>
                                        </div>
                                    )}

                                    {item.field_name === 'created' && (
                                        <div style={{
                                            marginTop: 'var(--spacing-sm)',
                                            padding: 'var(--spacing-sm)',
                                            background: 'hsla(220, 90%, 56%, 0.1)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-primary)',
                                            fontWeight: 500
                                        }}>
                                            {item.new_value}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary">
                        {t.orders.editHistory.close}
                    </button>
                </div>
            </div>
        </div>
    )
}
