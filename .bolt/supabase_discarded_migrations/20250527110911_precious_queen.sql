/*
  # Fix monthly_data foreign key relationship

  1. Changes
    - Add explicit foreign key constraint for monthly_data.phase_id referencing phases.id
    - Update the join query format in the application code

  2. Security
    - No changes to RLS policies
*/

-- First ensure the phase_id column exists and is of type uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'monthly_data' 
    AND column_name = 'phase_id' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE monthly_data ALTER COLUMN phase_id TYPE uuid USING phase_id::uuid;
  END IF;
END $$;

-- Add the foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'monthly_data_phase_id_fkey'
  ) THEN
    ALTER TABLE monthly_data 
    ADD CONSTRAINT monthly_data_phase_id_fkey 
    FOREIGN KEY (phase_id) 
    REFERENCES phases(id);
  END IF;
END $$;