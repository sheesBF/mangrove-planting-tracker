/*
  # Update species tables to include monthly data

  1. Changes
    - Drop existing species data tables
    - Create new species data tables with monthly tracking
    - Add appropriate constraints and policies
    - Populate with sample data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing species data tables
DROP TABLE IF EXISTS phase1_species_data;
DROP TABLE IF EXISTS phase2_species_data;
DROP TABLE IF EXISTS phase3_species_data;

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

-- Populate Species Data with monthly plans
WITH RECURSIVE dates AS (
  SELECT '2024-11-01'::timestamp AS month
  UNION ALL
  SELECT month + interval '1 month'
  FROM dates
  WHERE month < '2026-12-01'::timestamp
),
species_list AS (
  SELECT unnest(ARRAY[
    'Ceriops tagal',
    'Rhizophora mucronata',
    'Avicennia marina',
    'Bruguiera gymnorrhiza'
  ]) as species_name
)
-- Phase 1 Species Data
INSERT INTO phase1_species_data (month, species_name, planned_trees)
SELECT 
  d.month::date,
  s.species_name,
  CASE s.species_name
    WHEN 'Ceriops tagal' THEN 125
    WHEN 'Rhizophora mucronata' THEN 125
    WHEN 'Avicennia marina' THEN 75
    WHEN 'Bruguiera gymnorrhiza' THEN 75
  END as planned_trees
FROM dates d
CROSS JOIN species_list s
ON CONFLICT (month, species_name) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees;

-- Phase 2 Species Data
INSERT INTO phase2_species_data (month, species_name, planned_trees)
SELECT 
  d.month::date,
  s.species_name,
  CASE s.species_name
    WHEN 'Ceriops tagal' THEN 125
    WHEN 'Rhizophora mucronata' THEN 175
    WHEN 'Avicennia marina' THEN 125
    WHEN 'Bruguiera gymnorrhiza' THEN 75
  END as planned_trees
FROM dates d
CROSS JOIN species_list s
ON CONFLICT (month, species_name) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees;

-- Phase 3 Species Data
INSERT INTO phase3_species_data (month, species_name, planned_trees)
SELECT 
  d.month::date,
  s.species_name,
  CASE s.species_name
    WHEN 'Ceriops tagal' THEN 100
    WHEN 'Rhizophora mucronata' THEN 100
    WHEN 'Avicennia marina' THEN 75
    WHEN 'Bruguiera gymnorrhiza' THEN 75
  END as planned_trees
FROM dates d
CROSS JOIN species_list s
ON CONFLICT (month, species_name) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees;