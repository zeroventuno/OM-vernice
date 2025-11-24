import jsPDF from 'jspdf'
import type { Order } from './supabase'
import { translations } from './translations'

export async function generatePDF(orders: Order[]) {
    // Load logo
    const logoImg = new Image()
    logoImg.src = '/om_logo_new.png'
    await new Promise((resolve, reject) => {
        logoImg.onload = resolve
        logoImg.onerror = () => {
            console.warn('Logo not found, continuing without it')
            resolve(null)
        }
    })

    // Force Italian translations for PDF
    const t = translations['it']

    for (const order of orders) {
        // 1. Generate Standard A5 PDF
        generateStandardPDF(order, t, logoImg)

        // 2. Generate Box A5 PDF (Miniature)
        generateBoxPDF(order, t, logoImg)
    }
}

function generateStandardPDF(order: Order, t: any, logoImg: HTMLImageElement) {
    // A4 size: 210 x 297 mm
    const pageWidth = 210
    const pageHeight = 297
    const margin = 15 // Increased margin for A4
    const contentWidth = pageWidth - (margin * 2)

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    // Draw Page Border
    pdf.setLineWidth(0.5)
    pdf.setDrawColor(0, 0, 0)
    pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2))

    let yPosition = margin + 10

    // --- Header ---
    // Logo (Left)
    const logoWidth = 30 // Slightly larger for A4
    const logoHeight = 30
    pdf.addImage(logoImg, 'PNG', margin + 5, yPosition - 5, logoWidth, logoHeight)

    // Title (Center)
    pdf.setFontSize(20) // Larger font for A4
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 0, 0)
    pdf.text('SCHEDA COLORE', pageWidth / 2, yPosition + 8, { align: 'center' })

    // Order Number (Right)
    const orderNumWidth = 45
    const orderNumHeight = 14
    const orderNumX = pageWidth - margin - orderNumWidth - 5

    pdf.setFillColor(0, 0, 0)
    pdf.rect(orderNumX, yPosition + 2, orderNumWidth, orderNumHeight, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.text(order.ordem, orderNumX + (orderNumWidth / 2), yPosition + 10.5, { align: 'center' })

    yPosition += 35

    // Reset text color
    pdf.setTextColor(0, 0, 0)

    // Helper for sections
    const addSection = (title: string, fields: { label: string, value: string }[]) => {
        const estimatedHeight = 10 + (fields.length * 7)
        if (yPosition + estimatedHeight > pageHeight - margin - 15) {
            pdf.addPage()
            pdf.setLineWidth(0.5)
            pdf.setDrawColor(0, 0, 0)
            pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2))
            yPosition = margin + 15
        }

        // Section Header
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin + 2, yPosition, contentWidth - 4, 8, 'F')

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(title.toUpperCase(), margin + 6, yPosition + 5.5)

        yPosition += 12

        // Fields
        fields.forEach(field => {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text(field.label + ':', margin + 6, yPosition)

            pdf.setFont('helvetica', 'normal')
            const value = field.value || '-'

            // Align values
            const valueX = margin + 60
            const textWidth = contentWidth - 70
            const lines = pdf.splitTextToSize(value, textWidth)

            pdf.text(lines, valueX, yPosition)
            yPosition += (6 * lines.length) + 2
        })

        yPosition += 4
    }

    // Content Sections
    addSection(t.orders.generalInfo, [
        { label: t.orders.frameNumber, value: order.matricula_quadro },
        { label: t.orders.model, value: order.modelo },
        { label: t.orders.size, value: order.tamanho },
        { label: t.orders.agent, value: order.agente_comercial },
        { label: t.orders.catalog2026, value: order.catalogo_2026 ? t.common.yes : t.common.no }
    ])

    addSection(t.orders.base, [
        { label: t.orders.baseColor, value: order.cor_base },
        { label: t.orders.baseFinish, value: order.acabamento_base },
        { label: t.orders.baseRock, value: order.acabamento_base_rock ? t.common.yes : t.common.no }
    ])

    addSection(t.orders.details, [
        { label: t.orders.detailsColor, value: order.cor_detalhes },
        { label: t.orders.detailsFinish, value: order.acabamento_detalhes },
        { label: t.orders.detailsRock, value: order.acabamento_detalhes_rock ? t.common.yes : t.common.no }
    ])

    addSection(t.orders.logo, [
        { label: t.orders.logoColor, value: order.cor_logo },
        { label: t.orders.logoFinish, value: order.acabamento_logo },
        { label: t.orders.logoRock, value: order.acabamento_logo_rock ? t.common.yes : t.common.no }
    ])

    addSection(t.orders.letters, [
        { label: t.orders.lettersColor, value: order.cor_letras },
        { label: t.orders.lettersFinish, value: order.acabamento_letras },
        { label: t.orders.lettersRock, value: order.acabamento_letras_rock ? t.common.yes : t.common.no }
    ])

    if (order.pedidos_extras) {
        addSection(t.orders.extras, [
            { label: 'Note', value: order.pedidos_extras }
        ])
    }

    // Footer
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(128, 128, 128)
    const dateStr = `${t.common.date}: ${new Date(order.created_at).toLocaleDateString('it-IT')}`
    pdf.text(dateStr, margin + 5, pageHeight - margin - 5)

    pdf.save(`Scheda_${order.ordem}.pdf`)
}

function generateBoxPDF(order: Order, t: any, logoImg: HTMLImageElement) {
    // A5 size: 148 x 210 mm
    const pageWidth = 148
    const pageHeight = 210
    const margin = 10
    const contentWidth = pageWidth - (margin * 2)

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
    })

    // Border
    pdf.setLineWidth(0.5)
    pdf.setDrawColor(0, 0, 0)
    pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2))

    let yPosition = margin + 5

    // Header
    const logoWidth = 20
    const logoHeight = 20
    pdf.addImage(logoImg, 'PNG', margin + 2, yPosition, logoWidth, logoHeight)

    // Order Number Box
    const orderNumWidth = 40
    const orderNumHeight = 12
    const orderNumX = pageWidth - margin - orderNumWidth - 2

    pdf.setFillColor(0, 0, 0)
    pdf.rect(orderNumX, yPosition + 2, orderNumWidth, orderNumHeight, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(order.ordem, orderNumX + (orderNumWidth / 2), yPosition + 9, { align: 'center' })

    yPosition += 25
    pdf.setTextColor(0, 0, 0)

    // Compact Fields Helper
    const addCompactField = (label: string, value: string, isBold: boolean = false) => {
        if (yPosition > pageHeight - margin - 5) {
            pdf.addPage()
            pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2))
            yPosition = margin + 5
        }

        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.text(label + ':', margin + 3, yPosition)

        pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
        const val = value || '-'

        const valueX = margin + 35
        const textWidth = contentWidth - 40
        const lines = pdf.splitTextToSize(val, textWidth)

        pdf.text(lines, valueX, yPosition)
        yPosition += (4 * lines.length) + 1
    }

    // Section Header Helper
    const addSectionHeader = (title: string) => {
        yPosition += 2
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin + 2, yPosition - 4, contentWidth - 4, 6, 'F')
        pdf.text(title.toUpperCase(), margin + 4, yPosition)
        yPosition += 5
    }

    // Main Info
    addSectionHeader('INFO')
    addCompactField(t.orders.model, order.modelo, true)
    addCompactField(t.orders.size, order.tamanho, true)
    addCompactField(t.orders.frameNumber, order.matricula_quadro)
    addCompactField(t.orders.agent, order.agente_comercial)
    addCompactField(t.orders.catalog2026, order.catalogo_2026 ? t.common.yes : t.common.no)

    // Colors
    addSectionHeader('COLORI')

    // Base
    addCompactField(t.orders.baseColor, order.cor_base)
    addCompactField(t.orders.baseFinish, order.acabamento_base)
    addCompactField(t.orders.baseRock, order.acabamento_base_rock ? t.common.yes : t.common.no)

    yPosition += 2 // Spacer

    // Details
    addCompactField(t.orders.detailsColor, order.cor_detalhes)
    addCompactField(t.orders.detailsFinish, order.acabamento_detalhes)
    addCompactField(t.orders.detailsRock, order.acabamento_detalhes_rock ? t.common.yes : t.common.no)

    yPosition += 2 // Spacer

    // Logo
    addCompactField(t.orders.logoColor, order.cor_logo)
    addCompactField(t.orders.logoFinish, order.acabamento_logo)
    addCompactField(t.orders.logoRock, order.acabamento_logo_rock ? t.common.yes : t.common.no)

    yPosition += 2 // Spacer

    // Letters
    addCompactField(t.orders.lettersColor, order.cor_letras)
    addCompactField(t.orders.lettersFinish, order.acabamento_letras)
    addCompactField(t.orders.lettersRock, order.acabamento_letras_rock ? t.common.yes : t.common.no)

    if (order.pedidos_extras) {
        addSectionHeader('NOTE')
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        const lines = pdf.splitTextToSize(order.pedidos_extras, contentWidth - 6)
        pdf.text(lines, margin + 3, yPosition)
    }

    pdf.save(`SchedaBox_${order.ordem}.pdf`)
}
