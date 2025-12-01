'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase, type Order, type EditHistory } from '@/lib/supabase'
import { exportToExcel } from '@/lib/excel'
import { useRouter } from 'next/navigation'
import { generatePDF } from '@/lib/pdf'
import EditHistoryModal from '@/components/EditHistoryModal'
import EditModal from '@/components/EditModal'
import {
    FileText,
    Download,
    Printer,
    Search,
    Filter,
    Plus,
    Trash2,
    Pencil,
    History,
    X,
    FileSpreadsheet
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

export default function OrdersPage() {
    const { language, t } = useLanguage()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
    const [filterText, setFilterText] = useState('')
    const [historyModal, setHistoryModal] = useState<{ orderId: string; history: EditHistory[] } | null>(null)
    const [editModal, setEditModal] = useState<string | null>(null)
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('')

    useEffect(() => {
        loadOrders()
        loadCurrentUser()
    }, [])

    useEffect(() => {
        // Apply both status filter and text filter
        const filtered = orders.filter(order => {
            // Status filter
            if (statusFilter !== 'all' && order.status !== statusFilter) {
                return false
            }

            // Text filter (only if there's search text)
            if (filterText) {
                const searchText = filterText.toLowerCase()
                return (
                    order.ordem.toLowerCase().includes(searchText) ||
                    order.matricula_quadro.toLowerCase().includes(searchText) ||
                    order.modelo.toLowerCase().includes(searchText) ||
                    order.agente_comercial.toLowerCase().includes(searchText) ||
                    order.cor_base.toLowerCase().includes(searchText)
                )
            }

            return true
        })
        setFilteredOrders(filtered)
    }, [filterText, statusFilter, orders])

    async function loadCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setCurrentUserEmail(user.email)
            }
        } catch (error) {
            console.error('Error loading user:', error)
        }
    }

    async function loadOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
            setFilteredOrders(data || [])
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    async function loadHistory(orderId: string) {
        try {
            const { data, error } = await supabase
                .from('edit_history')
                .select(`
          *,
          user:users(email)
        `)
                .eq('order_id', orderId)
                .order('edited_at', { ascending: false })

            if (error) throw error

            setHistoryModal({ orderId, history: data || [] })
        } catch (error) {
            console.error('Error loading history:', error)
        }
    }

    function toggleSelectAll() {
        if (selectedOrders.size === filteredOrders.length) {
            setSelectedOrders(new Set())
        } else {
            setSelectedOrders(new Set(filteredOrders.map(o => o.id)))
        }
    }


    function toggleSelect(orderId: string) {
        const newSelected = new Set(selectedOrders)
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId)
        } else {
            newSelected.add(orderId)
        }
        setSelectedOrders(newSelected)
    }

    async function handleDeleteOrder(orderId: string, orderNumber: string) {
        // Confirmação antes de deletar
        const confirmed = confirm(
            `${t.common.delete} pedido ${orderNumber}?\n\nEsta ação não pode ser desfeita.`
        )

        if (!confirmed) return

        try {
            // Deletar histórico de edições primeiro (devido à foreign key)
            const { error: historyError } = await supabase
                .from('edit_history')
                .delete()
                .eq('order_id', orderId)

            if (historyError) throw historyError

            // Deletar o pedido
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId)

            if (orderError) throw orderError

            // Remover da seleção se estiver selecionado
            if (selectedOrders.has(orderId)) {
                const newSelected = new Set(selectedOrders)
                newSelected.delete(orderId)
                setSelectedOrders(newSelected)
            }

            // Recarregar lista
            await loadOrders()

            alert(`Pedido ${orderNumber} deletado com sucesso!`)
        } catch (error) {
            console.error('Error deleting order:', error)
            alert(`Erro ao deletar pedido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        }
    }


    function handleExportExcel() {
        const ordersToExport = orders.filter(o => selectedOrders.has(o.id))
        if (ordersToExport.length === 0) {
            alert(t.orders.title + ': ' + t.common.selected)
            return
        }
        exportToExcel(ordersToExport)
    }

    function handlePrint() {
        const ordersToprint = orders.filter(o => selectedOrders.has(o.id))
        if (ordersToprint.length === 0) {
            alert(t.common.print + ': ' + t.common.selected)
            return
        }

        // Create print-friendly view
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedidos - Impressão</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #333; color: white; }
            h1 { color: #333; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Pedidos de Pintura - Officine Mattio</h1>
          <button onclick="window.print()" style="margin-bottom: 20px; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir
          </button>
          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Matrícula</th>
                <th>Modelo</th>
                <th>Tamanho</th>
                <th>Agente</th>
                <th>Cat. 2026</th>
                <th>Cor Base</th>
                <th>Acab. Base</th>
                <th>Rock Base</th>
                <th>Cor Det.</th>
                <th>Acab. Det.</th>
                <th>Rock Det.</th>
                <th>Cor Logo</th>
                <th>Acab. Logo</th>
                <th>Rock Logo</th>
                <th>Cor Letras</th>
                <th>Acab. Letras</th>
                <th>Rock Letras</th>
                <th>Pedidos Extras</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              ${ordersToprint.map(order => `
                <tr>
                  <td>${order.ordem}</td>
                  <td>${order.matricula_quadro}</td>
                  <td>${order.modelo}</td>
                  <td>${order.tamanho}</td>
                  <td>${order.agente_comercial}</td>
                  <td>${order.catalogo_2026 ? '✓' : '-'}</td>
                  <td>${order.cor_base}</td>
                  <td>${order.acabamento_base}</td>
                  <td>${order.acabamento_base_rock ? '✓' : '-'}</td>
                  <td>${order.cor_detalhes}</td>
                  <td>${order.acabamento_detalhes}</td>
                  <td>${order.acabamento_detalhes_rock ? '✓' : '-'}</td>
                  <td>${order.cor_logo}</td>
                  <td>${order.acabamento_logo}</td>
                  <td>${order.acabamento_logo_rock ? '✓' : '-'}</td>
                  <td>${order.cor_letras}</td>
                  <td>${order.acabamento_letras}</td>
                  <td>${order.acabamento_letras_rock ? '✓' : '-'}</td>
                  <td>${order.pedidos_extras || '-'}</td>
                  <td>${new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

        printWindow.document.write(html)
        printWindow.document.close()
    }

    async function handleGeneratePDF() {
        const ordersToGenerate = orders.filter(o => selectedOrders.has(o.id))
        if (ordersToGenerate.length === 0) {
            alert(t.common.generatePDF + ': ' + t.common.selected)
            return
        }

        await generatePDF(ordersToGenerate)

        // Mark orders as completed
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .in('id', ordersToGenerate.map(o => o.id))

            if (error) throw error

            // Reload orders to reflect status change
            await loadOrders()
        } catch (error) {
            console.error('Error updating order status:', error)
        }
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <div>
                    <h1>{t.orders.title}</h1>
                    <p className="text-muted">{t.orders.subtitle}</p>
                </div>
                <a href="/orders/new" className="btn" style={{
                    background: 'white',
                    color: 'var(--color-primary)',
                    border: '2px solid var(--color-primary)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontWeight: 600
                }}>
                    <Plus size={20} /> {t.orders.newOrder}
                </a>
            </div>

            {/* Toolbar */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={t.common.filter}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.875rem' }}
                        >
                            {t.common.all}
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`btn ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.875rem' }}
                        >
                            {t.common.pending}
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`btn ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.875rem' }}
                        >
                            {t.common.completed}
                        </button>
                    </div>
                    <button
                        onClick={handleExportExcel}
                        className="btn btn-secondary"
                        disabled={selectedOrders.size === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                        <FileSpreadsheet size={18} /> {t.common.exportExcel}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn btn-secondary"
                        disabled={selectedOrders.size === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                        <Printer size={18} /> {t.common.print}
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        className="btn btn-success"
                        disabled={selectedOrders.size === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                        <FileText size={18} /> {t.common.generatePDF}
                    </button>
                </div>
                {selectedOrders.size > 0 && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        {selectedOrders.size} {t.common.selected}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="table-container" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table className="table" style={{ minWidth: '1400px', width: '100%', fontSize: '0.875rem' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                                        onChange={toggleSelectAll}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </th>
                                <th>{t.orders.orderNumber}</th>
                                <th>{t.orders.frameNumber}</th>
                                <th>{t.orders.model}</th>
                                <th>{t.orders.size}</th>
                                <th>{t.orders.agent}</th>
                                <th>{t.orders.catalog2026}</th>
                                <th>{t.orders.baseColor}</th>
                                <th>{t.orders.baseFinish}</th>
                                <th>{t.orders.baseRock}</th>
                                <th>{t.orders.detailsColor}</th>
                                <th>{t.orders.detailsFinish}</th>
                                <th>{t.orders.detailsRock}</th>
                                <th>{t.orders.logoColor}</th>
                                <th>{t.orders.logoFinish}</th>
                                <th>{t.orders.logoRock}</th>
                                <th>{t.orders.lettersColor}</th>
                                <th>{t.orders.lettersFinish}</th>
                                <th>{t.orders.lettersRock}</th>
                                <th>{t.orders.extraRequests}</th>
                                <th>{t.common.date}</th>
                                <th style={{ width: '200px' }}>{t.common.actions}</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={22} style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                        <div style={{ color: 'var(--color-text-tertiary)' }}>
                                            {filterText ? t.orders.noOrders : t.orders.noOrders}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        style={{
                                            backgroundColor: order.status === 'completed'
                                                ? 'rgba(72, 187, 120, 0.15)'
                                                : order.status === 'pending'
                                                    ? 'rgba(255, 165, 0, 0.15)'
                                                    : index % 2 === 0 ? 'white' : 'var(--color-bg-secondary)',
                                            border: order.urgente ? '2px solid #ef4444' : 'none',
                                            color: order.urgente ? '#b91c1c' : 'inherit',
                                            fontWeight: order.urgente ? 500 : 'normal'
                                        }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.has(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{order.ordem}</td>
                                        <td>{order.matricula_quadro}</td>
                                        <td>{order.modelo}</td>
                                        <td>{order.tamanho}</td>
                                        <td>{order.agente_comercial}</td>
                                        <td>{order.catalogo_2026 ? '✓' : '-'}</td>
                                        <td>{order.cor_base}</td>
                                        <td>{order.acabamento_base}</td>
                                        <td>{order.acabamento_base_rock ? '✓' : '-'}</td>
                                        <td>{order.cor_detalhes}</td>
                                        <td>{order.acabamento_detalhes}</td>
                                        <td>{order.acabamento_detalhes_rock ? '✓' : '-'}</td>
                                        <td>{order.cor_logo}</td>
                                        <td>{order.acabamento_logo}</td>
                                        <td>{order.acabamento_logo_rock ? '✓' : '-'}</td>
                                        <td>{order.cor_letras}</td>
                                        <td>{order.acabamento_letras}</td>
                                        <td>{order.acabamento_letras_rock ? '✓' : '-'}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.pedidos_extras || '-'}
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button
                                                    onClick={() => setEditModal(order.id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => loadHistory(order.id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Ver histórico"
                                                >
                                                    <History size={16} />
                                                </button>
                                                {currentUserEmail === 'admin@officinemattio.com' && (
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id, order.ordem)}
                                                        className="btn"
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: 'var(--color-error)',
                                                            color: 'white',
                                                            border: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        title="Deletar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: order.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)',
                                                color: 'white'
                                            }}>
                                                {order.status === 'completed' ? 'Completo' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Modal */}
            {historyModal && (
                <EditHistoryModal
                    orderId={historyModal.orderId}
                    history={historyModal.history}
                    onClose={() => setHistoryModal(null)}
                />
            )}

            {/* Edit Modal */}
            {editModal && (
                <EditModal
                    orderId={editModal}
                    isOpen={!!editModal}
                    onClose={() => setEditModal(null)}
                    onSuccess={() => {
                        loadOrders()
                        setEditModal(null)
                    }}
                />
            )}
        </div>
    )
}
