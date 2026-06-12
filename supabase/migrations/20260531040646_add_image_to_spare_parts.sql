/*
  # Add image column to spare_parts

  1. Changes
    - Adds `image` (text, nullable) column to the `spare_parts` table to store a Supabase Storage public URL
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spare_parts' AND column_name = 'image'
  ) THEN
    ALTER TABLE spare_parts ADD COLUMN image text NOT NULL DEFAULT '';
  END IF;
END $$;
