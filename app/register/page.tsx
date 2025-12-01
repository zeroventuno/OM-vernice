'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Check, ChevronRight, ChevronLeft, Globe } from 'lucide-react'
import { translations, type Language } from '@/lib/translations'
import { BIKE_MODELS, WHEEL_MODELS, PRODUCT_TYPES, COUNTRIES } from '@/lib/constants'
import { submitRegistration, type RegistrationFormData, type ProductInput } from './actions'

export default function RegisterPage() {
    const [language, setLanguage] = useState<Language>('pt-BR')
    const t = translations[language].registration
    const common = translations[language].common

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<RegistrationFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        products: [
            {
                productType: '',
                model: '',
                serialNumber: '',
                notes: ''
            }
        ]
    })

    const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleProductChange = (index: number, field: keyof ProductInput, value: string) => {
        const newProducts = [...formData.products]
        newProducts[index] = { ...newProducts[index], [field]: value }
        setFormData(prev => ({ ...prev, products: newProducts }))
    }

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                { productType: '', model: '', serialNumber: '', notes: '' }
            ]
        }))
    }

    const removeProduct = (index: number) => {
        if (formData.products.length === 1) return
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const result = await submitRegistration(formData)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setError(result.error || 'Erro desconhecido')
            }
        } catch (err) {
            setError('Erro ao enviar formulário')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getModelOptions = (type: string) => {
        if (type === 'bike' || type === 'frame') return BIKE_MODELS
        if (type === 'wheels') return WHEEL_MODELS
        return []
    }

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.successTitle}</h2>
                <p className="text-gray-600 mb-8 text-lg">{t.successMessage}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    {t.backToHome}
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Language Switcher */}
            <div className="flex justify-end mb-6">
                <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                    <button
                        onClick={() => setLanguage('pt-BR')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${language === 'pt-BR' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        PT
                    </button>
                    <button
                        onClick={() => setLanguage('it')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${language === 'it' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        IT
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Progress Bar */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between max-w-xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                1
                            </div>
                            <span className="text-xs font-medium mt-2 text-gray-600">{t.personalInfo}</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                2
                            </div>
                            <span className="text-xs font-medium mt-2 text-gray-600">{t.productInfo}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{t.personalInfo}</h2>
                                <p className="text-gray-500 mt-1">{t.subtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.firstName} *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.lastName} *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone} *</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                                            onChange={(e) => {
                                                // Optional: Prepend code to phone if needed, but for now just letting user type or handle separately
                                                // Actually let's just keep it simple and let user type full number or use the prefix list as reference
                                            }}
                                        >
                                            {COUNTRIES.map(c => (
                                                <option key={c.code} value={c.dial_code}>{c.code} {c.dial_code}</option>
                                            ))}
                                        </select>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="+39 123 456 7890"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.address} *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.city} *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.state}</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.zipCode} *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.country} *</label>
                                <select
                                    required
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white transition-all"
                                >
                                    <option value="">{t.selectCountry}</option>
                                    {COUNTRIES.map(c => (
                                        <option key={c.code} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {t.next}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Product Info */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{t.productInfo}</h2>
                                <p className="text-gray-500 mt-1">{t.subtitle}</p>
                            </div>

                            {formData.products.map((product, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                                    {formData.products.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}

                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        {t.productInfo} #{index + 1}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.productType} *</label>
                                            <select
                                                required
                                                value={product.productType}
                                                onChange={(e) => handleProductChange(index, 'productType', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                                            >
                                                <option value="">{t.selectProduct}</option>
                                                {PRODUCT_TYPES.map(type => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.model} *</label>
                                            <select
                                                required
                                                disabled={!product.productType}
                                                value={product.model}
                                                onChange={(e) => handleProductChange(index, 'model', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                            >
                                                <option value="">{t.selectModel}</option>
                                                {getModelOptions(product.productType).map(model => (
                                                    <option key={model} value={model}>
                                                        {model === 'Other' ? t.other : model}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {product.model === 'Other' && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.otherModel} *</label>
                                            <input
                                                required
                                                type="text"
                                                value={product.customModel || ''}
                                                onChange={(e) => handleProductChange(index, 'customModel', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            />
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.serialNumber} *</label>
                                        <input
                                            required
                                            type="text"
                                            value={product.serialNumber}
                                            onChange={(e) => handleProductChange(index, 'serialNumber', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            placeholder="OM..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
                                        <textarea
                                            value={product.notes}
                                            onChange={(e) => handleProductChange(index, 'notes', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addProduct}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-black hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {t.addAnother}
                            </button>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-between pt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-gray-600 hover:text-black px-6 py-3 font-medium transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    {t.prev}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? common.loading : t.submit}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
