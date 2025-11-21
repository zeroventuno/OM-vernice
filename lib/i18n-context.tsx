'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language } from './translations'

type I18nContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pt-BR')

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && (savedLang === 'pt-BR' || savedLang === 'it')) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('language', lang)
    }

    const t = (path: string) => {
        const keys = path.split('.')
        let current: any = translations[language]

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`)
                return path
            }
            current = current[key]
        }

        return current as string
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider')
    }
    return context
}
