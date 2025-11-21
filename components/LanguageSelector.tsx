'use client'

import { useTranslation } from '@/lib/i18n-context'

export default function LanguageSelector() {
    const { language, setLanguage } = useTranslation()

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLanguage('pt-BR')}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${language === 'pt-BR' ? 'bg-gray-200' : ''
                    }`}
                title="Português (Brasil)"
            >
                <span style={{ fontSize: '1.5rem' }}>🇧🇷</span>
            </button>
            <button
                onClick={() => setLanguage('it')}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${language === 'it' ? 'bg-gray-200' : ''
                    }`}
                title="Italiano"
            >
                <span style={{ fontSize: '1.5rem' }}>🇮🇹</span>
            </button>
        </div>
    )
}
