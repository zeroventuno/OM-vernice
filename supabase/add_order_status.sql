-- Add status column to orders table
-- This migration is now idempotent (can be run multiple times safely)

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        ALTER TABLE orders 
        ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed'));
    END IF;
END $$;

-- Update existing NULL values to 'pending' (if any)
UPDATE orders SET status = 'pending' WHERE status IS NULL;

-- Create index for better query performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Verify the changes
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'status';
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

DO $$
BEGIN
  RAISE NOTICE '✅ Added status column to orders table';
  RAISE NOTICE '✅ Added check constraint for status values';
  RAISE NOTICE '✅ Created index on status column';
END $$;
