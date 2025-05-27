/*
  # Create monthly data table and relationships

  1. New Tables
    - Creates the monthly_data table if it doesn't exist
    - Adds all necessary columns with proper types
    - Sets up foreign key relationships with projects and phases tables

  2. Security
    - Enables RLS on monthly_data table
    - Adds policy for authenticated users to read data
*/

-- Create the monthly_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_id uuid REFERENCES phases(id),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares numeric(10,2),
  actual_trees integer,
  actual_hectares numeric(10,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, phase_id, month)
);

-- Enable RLS
ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;

-- Add read policy for authenticated users
CREATE POLICY "Allow read access to all users"
  ON monthly_data
  FOR SELECT
  TO authenticated
  USING (true);