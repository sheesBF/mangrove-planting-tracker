/*
  # Create species data tables
  
  1. New Tables
    For each phase (1-3), create a species_data table with:
      - `id` (uuid, primary key)
      - `month` (date)
      - `species_name` (text)
      - `planned_trees` (integer)
      - `actual_trees` (integer)
      - `created_at` (timestamp)
  
  2. Constraints
    - Unique constraint on month + species_name
  
  3. Security
    - Enable RLS on all tables
    - Add read policies for authenticated users
*/

-- Phase 1 Species Data
CREATE TABLE IF NOT EXISTS phase1_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase1_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase1_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 2 Species Data
CREATE TABLE IF NOT EXISTS phase2_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase2_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase2_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 3 Species Data
CREATE TABLE IF NOT EXISTS phase3_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase3_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase3_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Add composite unique constraints
ALTER TABLE phase1_species_data ADD CONSTRAINT phase1_species_data_month_species_key UNIQUE (month, species_name);
ALTER TABLE phase2_species_data ADD CONSTRAINT phase2_species_data_month_species_key UNIQUE (month, species_name);
ALTER TABLE phase3_species_data ADD CONSTRAINT phase3_species_data_month_species_key UNIQUE (month, species_name);