-- Enable RLS on the tables
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to all tables
CREATE POLICY "Allow public read access to artworks" 
ON artworks FOR SELECT USING (true);

CREATE POLICY "Allow public read access to artists" 
ON artists FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" 
ON categories FOR SELECT USING (true);

-- Create policy for inserting artworks (allow anyone to insert)
CREATE POLICY "Allow public insert access to artworks" 
ON artworks FOR INSERT WITH CHECK (true);

-- Create policy for updating artworks (allow anyone to update for now)
CREATE POLICY "Allow public update access to artworks" 
ON artworks FOR UPDATE USING (true);

-- Create policy for deleting artworks (allow anyone to delete for now)
CREATE POLICY "Allow public delete access to artworks" 
ON artworks FOR DELETE USING (true);

-- Set up storage policies for the artworks bucket
-- First, check if the policy already exists to avoid errors
DO $$
BEGIN
    -- Allow public read access to files in the artworks bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public read access to artworks'
    ) THEN
        CREATE POLICY "Allow public read access to artworks" 
        ON storage.objects FOR SELECT
        USING (bucket_id = 'artworks');
    END IF;

    -- Allow public insert access to files in the artworks bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public insert access to artworks'
    ) THEN
        CREATE POLICY "Allow public insert access to artworks" 
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'artworks');
    END IF;

    -- Allow public update access to files in the artworks bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public update access to artworks'
    ) THEN
        CREATE POLICY "Allow public update access to artworks" 
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'artworks');
    END IF;

    -- Allow public delete access to files in the artworks bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public delete access to artworks'
    ) THEN
        CREATE POLICY "Allow public delete access to artworks" 
        ON storage.objects FOR DELETE
        USING (bucket_id = 'artworks');
    END IF;
END $$;
