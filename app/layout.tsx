import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Verniciatura - Officine Mattio',
    description: 'Sistema de Gestão de Pedidos de Pintura de Bicicletas',
    icons: {
        icon: '/favicon.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    )
}
