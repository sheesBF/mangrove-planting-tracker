/*
  # Create phase-specific tables for monthly and species data

  1. New Tables
    - `phase1_monthly_data`
      - `id` (uuid, primary key)
      - `month` (date)
      - `planned_trees` (integer)
      - `planned_hectares` (numeric)
      - `actual_trees` (integer)
      - `actual_hectares` (numeric)
      - `created_at` (timestamp with time zone)

    - `phase2_monthly_data` (same structure as phase1)
    - `phase3_monthly_data` (same structure as phase1)
    
    - `phase1_species_data`
      - `id` (uuid, primary key)
      - `species_name` (text)
      - `trees_planted` (integer)
      - `created_at` (timestamp with time zone)

    - `phase2_species_data` (same structure as phase1)
    - `phase3_species_data` (same structure as phase1)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
*/

-- Phase 1 Monthly Data
CREATE TABLE IF NOT EXISTS phase1_monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares numeric(10,2),
  actual_trees integer,
  actual_hectares numeric(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase1_monthly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase1_monthly_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 2 Monthly Data
CREATE TABLE IF NOT EXISTS phase2_monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares numeric(10,2),
  actual_trees integer,
  actual_hectares numeric(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase2_monthly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase2_monthly_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 3 Monthly Data
CREATE TABLE IF NOT EXISTS phase3_monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares numeric(10,2),
  actual_trees integer,
  actual_hectares numeric(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase3_monthly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase3_monthly_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 1 Species Data
CREATE TABLE IF NOT EXISTS phase1_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_name text NOT NULL,
  trees_planted integer NOT NULL DEFAULT 0,
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
  species_name text NOT NULL,
  trees_planted integer NOT NULL DEFAULT 0,
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
  species_name text NOT NULL,
  trees_planted integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase3_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase3_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Add unique constraint on month for monthly data tables
ALTER TABLE phase1_monthly_data ADD CONSTRAINT phase1_monthly_data_month_key UNIQUE (month);
ALTER TABLE phase2_monthly_data ADD CONSTRAINT phase2_monthly_data_month_key UNIQUE (month);
ALTER TABLE phase3_monthly_data ADD CONSTRAINT phase3_monthly_data_month_key UNIQUE (month);

-- Add unique constraint on species_name for species data tables
ALTER TABLE phase1_species_data ADD CONSTRAINT phase1_species_data_species_name_key UNIQUE (species_name);
ALTER TABLE phase2_species_data ADD CONSTRAINT phase2_species_data_species_name_key UNIQUE (species_name);
ALTER TABLE phase3_species_data ADD CONSTRAINT phase3_species_data_species_name_key UNIQUE (species_name);