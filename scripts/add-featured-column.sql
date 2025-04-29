-- Add featured field to artworks table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'artworks'
        AND column_name = 'featured'
    ) THEN
        ALTER TABLE artworks ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update a few existing artworks to be featured
UPDATE artworks SET featured = true WHERE id IN (
  SELECT id FROM artworks ORDER BY created_at DESC LIMIT 3
);
