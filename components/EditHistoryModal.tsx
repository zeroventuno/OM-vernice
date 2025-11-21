import { useState } from 'react'
import { EditHistory } from '@/lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

type EditHistoryModalProps = {
    orderId: string
    history: EditHistory[]
    onClose: () => void
}

const fieldLabels: Record<string, string> = {
    ordem: 'Ordem',
    matricula_quadro: 'Matrícula do Quadro',
    modelo: 'Modelo',
    tamanho: 'Tamanho',
    agente_comercial: 'Agente Comercial',
    catalogo_2026: 'Catálogo 2026',
    cor_base: 'Cor Base',
    acabamento_base: 'Acabamento Base',
    acabamento_base_rock: 'Base Rock',
    cor_detalhes: 'Cor Detalhes',
    acabamento_detalhes: 'Acabamento Detalhes',
    acabamento_detalhes_rock: 'Detalhes Rock',
    cor_logo: 'Cor Logo',
    acabamento_logo: 'Acabamento Logo',
    acabamento_logo_rock: 'Logo Rock',
    cor_letras: 'Cor Letras',
    acabamento_letras: 'Acabamento Letras',
    acabamento_letras_rock: 'Letras Rock',
    pedidos_extras: 'Pedidos Extras',
    created: 'Criação'
}

export default function EditHistoryModal({ orderId, history, onClose }: EditHistoryModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: '800px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 style={{ margin: 0 }}>Histórico de Edições</h3>
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
                            <p>Nenhuma edição registrada</p>
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
                                                {fieldLabels[item.field_name] || item.field_name}
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {item.user?.email || 'Usuário desconhecido'}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-text-tertiary)',
                                            textAlign: 'right'
                                        }}>
                                            {format(new Date(item.edited_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
                                                    Anterior
                                                </div>
                                                {item.old_value || '(vazio)'}
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
                                                    Novo
                                                </div>
                                                {item.new_value || '(vazio)'}
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
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}
