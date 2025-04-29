-- Add featured field to artworks table
ALTER TABLE artworks ADD COLUMN featured BOOLEAN DEFAULT false;

-- Update a few existing artworks to be featured
UPDATE artworks SET featured = true WHERE id IN (
  SELECT id FROM artworks ORDER BY created_at DESC LIMIT 3
);
