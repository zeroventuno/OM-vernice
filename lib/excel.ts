import * as XLSX from 'xlsx'
import type { Order } from './supabase'

export function exportToExcel(orders: Order[], filename: string = 'pedidos') {
    // Prepare data for export
    const data = orders.map(order => ({
        'Ordem': order.ordem,
        'Matrícula do Quadro': order.matricula_quadro,
        'Modelo': order.modelo,
        'Tamanho': order.tamanho,
        'Agente Comercial': order.agente_comercial,
        'Catálogo 2026': order.catalogo_2026 ? 'Sim' : 'Não',
        'Cor Base': order.cor_base,
        'Acabamento Base': `${order.acabamento_base}${order.acabamento_base_rock ? ' + Rock' : ''}`,
        'Cor Detalhes': order.cor_detalhes,
        'Acabamento Detalhes': `${order.acabamento_detalhes}${order.acabamento_detalhes_rock ? ' + Rock' : ''}`,
        'Cor Logo': order.cor_logo,
        'Acabamento Logo': `${order.acabamento_logo}${order.acabamento_logo_rock ? ' + Rock' : ''}`,
        'Cor Letras': order.cor_letras,
        'Acabamento Letras': `${order.acabamento_letras}${order.acabamento_letras_rock ? ' + Rock' : ''}`,
        'Pedidos Extras': order.pedidos_extras || '',
        'Data de Criação': new Date(order.created_at).toLocaleDateString('pt-BR'),
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Set column widths
    const columnWidths = [
        { wch: 15 }, // Ordem
        { wch: 20 }, // Matrícula
        { wch: 15 }, // Modelo
        { wch: 10 }, // Tamanho
        { wch: 20 }, // Agente
        { wch: 15 }, // Catálogo
        { wch: 15 }, // Cor Base
        { wch: 20 }, // Acabamento Base
        { wch: 15 }, // Cor Detalhes
        { wch: 20 }, // Acabamento Detalhes
        { wch: 15 }, // Cor Logo
        { wch: 20 }, // Acabamento Logo
        { wch: 15 }, // Cor Letras
        { wch: 20 }, // Acabamento Letras
        { wch: 30 }, // Pedidos Extras
        { wch: 15 }, // Data
    ]
    worksheet['!cols'] = columnWidths

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos')

    // Generate file
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`)
}
