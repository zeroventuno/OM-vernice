import Image from 'next/image'
import Link from 'next/link'

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-6">
                <div className="container mx-auto px-4 flex justify-center">
                    <Link href="/">
                        <Image
                            src="/om-logo-registration.png"
                            alt="Officine Mattio"
                            width={200}
                            height={60}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    <p>Copyright © 2025 Ventuno. Tutti i diritti riservati.</p>
                </div>
            </footer>
        </div>
    )
}
