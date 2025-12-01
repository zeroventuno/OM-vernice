export const BIKE_MODELS = [
    'GRANFONDO',
    'BISALTA',
    'SL',
    'LEMMA RT',
    'SANTIAGO',
    'BRONDELLO DISC',
    'SL NEW DISC',
    'SL COMP 3K',
    'LEMMA 3.0',
    'SANTIAGO RT',
    'OM1',
    'OM1 RT',
    'Other'
] as const;

export const WHEEL_MODELS = [
    'OM 40',
    'OM 40 CS',
    'OM 50',
    'OM 50 CS',
    'OM WAVE 40',
    'OM WAVE 40 CS',
    'OM WAVE 50',
    'OM WAVE 50 CS',
    'OM WAVE 60',
    'OM WAVE 60 CS',
    'OM GRAVEL',
    'OM WAVE GRAVEL',
    'Other'
] as const;

export const PRODUCT_TYPES = [
    { value: 'bike', label: 'Bicicleta Completa / Bici Completa' },
    { value: 'frame', label: 'Quadro / Telaio' },
    { value: 'wheels', label: 'Rodas / Ruote' }
] as const;

// A comprehensive list of countries and phone codes
export const COUNTRIES = [
    { name: 'Italy', code: 'IT', dial_code: '+39' },
    { name: 'Brazil', code: 'BR', dial_code: '+55' },
    { name: 'United States', code: 'US', dial_code: '+1' },
    { name: 'United Kingdom', code: 'GB', dial_code: '+44' },
    { name: 'France', code: 'FR', dial_code: '+33' },
    { name: 'Germany', code: 'DE', dial_code: '+49' },
    { name: 'Spain', code: 'ES', dial_code: '+34' },
    { name: 'Portugal', code: 'PT', dial_code: '+351' },
    { name: 'Switzerland', code: 'CH', dial_code: '+41' },
    { name: 'Belgium', code: 'BE', dial_code: '+32' },
    { name: 'Netherlands', code: 'NL', dial_code: '+31' },
    { name: 'Austria', code: 'AT', dial_code: '+43' },
    { name: 'Canada', code: 'CA', dial_code: '+1' },
    { name: 'Australia', code: 'AU', dial_code: '+61' },
    { name: 'Japan', code: 'JP', dial_code: '+81' },
    { name: 'China', code: 'CN', dial_code: '+86' },
    { name: 'Argentina', code: 'AR', dial_code: '+54' },
    { name: 'Chile', code: 'CL', dial_code: '+56' },
    { name: 'Colombia', code: 'CO', dial_code: '+57' },
    { name: 'Mexico', code: 'MX', dial_code: '+52' },
    { name: 'Denmark', code: 'DK', dial_code: '+45' },
    { name: 'Sweden', code: 'SE', dial_code: '+46' },
    { name: 'Norway', code: 'NO', dial_code: '+47' },
    { name: 'Finland', code: 'FI', dial_code: '+358' },
    { name: 'Poland', code: 'PL', dial_code: '+48' },
    { name: 'Czech Republic', code: 'CZ', dial_code: '+420' },
    { name: 'Hungary', code: 'HU', dial_code: '+36' },
    { name: 'Greece', code: 'GR', dial_code: '+30' },
    { name: 'Turkey', code: 'TR', dial_code: '+90' },
    { name: 'Russia', code: 'RU', dial_code: '+7' },
    { name: 'India', code: 'IN', dial_code: '+91' },
    { name: 'South Africa', code: 'ZA', dial_code: '+27' },
    { name: 'United Arab Emirates', code: 'AE', dial_code: '+971' },
    { name: 'Saudi Arabia', code: 'SA', dial_code: '+966' },
    { name: 'Israel', code: 'IL', dial_code: '+972' },
    { name: 'South Korea', code: 'KR', dial_code: '+82' },
    { name: 'Singapore', code: 'SG', dial_code: '+65' },
    { name: 'New Zealand', code: 'NZ', dial_code: '+64' },
    { name: 'Ireland', code: 'IE', dial_code: '+353' },
    // Add more as needed, this covers major markets
].sort((a, b) => a.name.localeCompare(b.name));
