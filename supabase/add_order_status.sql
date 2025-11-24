-- Add status column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Add check constraint to ensure valid status values
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed'));

-- Update existing orders to have 'pending' status (if any were null before NOT NULL constraint)
-- Since we added NOT NULL DEFAULT 'pending', existing rows get 'pending' automatically.
-- But good to be explicit if we were doing this in steps.

-- Create index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

DO $$
BEGIN
  RAISE NOTICE '✅ Added status column to orders table';
  RAISE NOTICE '✅ Added check constraint for status values';
  RAISE NOTICE '✅ Created index on status column';
END $$;
