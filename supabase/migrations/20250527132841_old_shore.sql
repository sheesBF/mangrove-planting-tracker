/*
  # Create monthly data tables
  
  1. New Tables
    For each phase (1-3), create a monthly_data table with:
      - `id` (uuid, primary key)
      - `month` (date)
      - `planned_trees` (integer)
      - `planned_hectares` (numeric)
      - `actual_trees` (integer)
      - `actual_hectares` (numeric)
      - `created_at` (timestamp)
  
  2. Constraints
    - Unique constraint on month
  
  3. Security
    - Enable RLS on all tables
    - Add read policies for authenticated users
*/

-- Phase 1 Monthly Data
CREATE TABLE IF NOT EXISTS phase1_monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
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
  month date NOT NULL UNIQUE,
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
  month date NOT NULL UNIQUE,
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