/*
  # Create species data tables
  
  1. New Tables
    - `phase1_species_data` - Stores species data for phase 1
    - `phase2_species_data` - Stores species data for phase 2
    - `phase3_species_data` - Stores species data for phase 3
    
    Each table has:
      - `id` (uuid, primary key)
      - `month` (date, not null)
      - `species_name` (text, not null)
      - `planned_trees` (integer, not null, default 0)
      - `actual_trees` (integer, default 0)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Phase 1 Species Data
CREATE TABLE IF NOT EXISTS phase1_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(month, species_name)
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
  created_at timestamptz DEFAULT now(),
  UNIQUE(month, species_name)
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
  created_at timestamptz DEFAULT now(),
  UNIQUE(month, species_name)
);

ALTER TABLE phase3_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase3_species_data
  FOR SELECT
  TO authenticated
  USING (true);