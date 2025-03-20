
-- Create storage bucket for artwork uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'artworks', 'artworks', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'artworks'
);

-- Set up policy to allow authenticated users to upload to the artworks bucket
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
    'Allow users to upload their own artwork',
    '(auth.uid() = storage.foldername(name)::uuid)',
    'artworks'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'artworks' AND name = 'Allow users to upload their own artwork'
);

-- Allow public read access to all files in the artworks bucket
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
    'Allow public read access to artwork',
    'true',
    'artworks'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'artworks' AND name = 'Allow public read access to artwork'
);
