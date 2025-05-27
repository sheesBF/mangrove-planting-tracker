/*
  # Create phase totals table
  
  1. New Tables
    - `phase_totals`
      - `id` (uuid, primary key)
      - `phase_name` (text, unique)
      - `total_planned_trees` (integer)
      - `total_planned_hectares` (numeric)
      - `total_actual_trees` (integer)
      - `total_actual_hectares` (numeric)
      
  2. Security
    - Enable RLS on `phase_totals` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS phase_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_name text UNIQUE NOT NULL,
  total_planned_trees integer NOT NULL DEFAULT 0,
  total_planned_hectares numeric(10,2) NOT NULL DEFAULT 0,
  total_actual_trees integer NOT NULL DEFAULT 0,
  total_actual_hectares numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE phase_totals ENABLE ROW LEVEL SECURITY;

-- Add read policy for authenticated users
CREATE POLICY "Allow read access for authenticated users"
  ON phase_totals
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial rows for each phase
INSERT INTO phase_totals (phase_name, total_planned_trees, total_planned_hectares, total_actual_trees, total_actual_hectares)
VALUES 
  ('Phase 1', 0, 0, 0, 0),
  ('Phase 2', 0, 0, 0, 0),
  ('Phase 3', 0, 0, 0, 0)
ON CONFLICT (phase_name) DO NOTHING;