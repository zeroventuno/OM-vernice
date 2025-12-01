-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL
);

-- Create customer_products table
CREATE TABLE IF NOT EXISTS customer_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL, -- 'bike', 'frame', 'wheels'
    model TEXT NOT NULL,
    custom_model TEXT, -- If "Other" is selected
    serial_number TEXT,
    notes TEXT
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (insert only)
-- We want anyone to be able to register, but not necessarily see other's data (privacy).
-- Since there is no login for this part, we might just allow INSERT for anon role.

CREATE POLICY "Enable insert for everyone" ON customers
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable insert for everyone" ON customer_products
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Optional: Allow read access only to authenticated users (admins) if they need to see it in the dashboard later.
CREATE POLICY "Enable read access for authenticated users" ON customers
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for authenticated users" ON customer_products
    FOR SELECT
    TO authenticated
    USING (true);
