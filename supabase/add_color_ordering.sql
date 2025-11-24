-- Add display_order column to colors table for custom ordering
-- Execute this in Supabase SQL Editor

-- Step 1: Add display_order column
ALTER TABLE colors 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Step 2: Set order for existing colors (alphabetically for now)
-- You can modify these numbers to change the order
WITH ordered_colors AS (
  SELECT 
    id,
    name,
    ROW_NUMBER() OVER (ORDER BY name) AS new_order
  FROM colors
)
UPDATE colors
SET display_order = ordered_colors.new_order
FROM ordered_colors
WHERE colors.id = ordered_colors.id;

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_colors_display_order ON colors(display_order);

-- View current order
SELECT id, name, display_order 
FROM colors 
ORDER BY display_order;

-- ========================================
-- HOW TO CHANGE ORDER:
-- ========================================
-- To move a color to first position:
-- UPDATE colors SET display_order = 0 WHERE name = 'Nome da Cor';

-- To set specific positions:
-- UPDATE colors SET display_order = 1 WHERE name = 'Primeira Cor';
-- UPDATE colors SET display_order = 2 WHERE name = 'Segunda Cor';
-- UPDATE colors SET display_order = 3 WHERE name = 'Terceira Cor';
